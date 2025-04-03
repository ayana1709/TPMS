<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Region;
use App\Models\Zone;
use App\Models\Woreda;
use Illuminate\Support\Facades\Http;

class OSMController extends Controller
{
    // Fetch and store all Ethiopian regions
    public function fetchRegions() {
        $url = "https://overpass-api.de/api/interpreter?data=[out:json];area[\"ISO3166-1\"=\"ET\"]->.ethiopia;relation(area.ethiopia)[\"admin_level\"=\"4\"];out body;";
        $response = Http::get($url)->json();

        foreach ($response['elements'] as $region) {
            Region::updateOrCreate([
                'osm_id' => $region['id']
            ], [
                'name' => $region['tags']['name']
            ]);
        }

        // **Return the stored regions**
        return response()->json(Region::all());
    }

    // Fetch and store zones inside a region
    public function fetchZones($regionOsmId) {
        // Convert region OSM ID to area ID (Overpass uses 3600000000 + region_id)
        $areaId = 3600000000 + $regionOsmId;
    
        // Correct Overpass API query
        $url = "https://overpass-api.de/api/interpreter?data=[out:json];area($areaId)->.region;
        (
          relation[\"admin_level\"=\"5\"](area.region);
        );
        out body;";
    
        // Fetch data
        $response = Http::get($url)->json();
    
        if (!isset($response['elements'])) {
            return response()->json(['error' => 'No zones found'], 404);
        }
    
        // Store or update zones
        foreach ($response['elements'] as $zone) {
            if (isset($zone['tags']['name'])) {
                Zone::updateOrCreate(
                    ['osm_id' => $zone['id']],
                    [
                        'name' => $zone['tags']['name'],
                        'region_id' => $regionOsmId
                    ]
                );
            }
        }
    
        // Return stored zones
        return response()->json(Zone::where('region_id', $regionOsmId)->get());
    }
    

    // Fetch and store woredas inside a zone
    public function fetchTowns($zoneOsmId) {
        // Convert zone OSM ID to area ID
        $areaId = 3600000000 + $zoneOsmId;
    
        // Overpass API query to get towns, cities, and villages
        $url = "https://overpass-api.de/api/interpreter?data=[out:json];
        area($areaId)->.zone;
        (
          node[\"place\"=\"town\"](area.zone);
          node[\"place\"=\"city\"](area.zone);
          node[\"place\"=\"village\"](area.zone);
        );
        out body;";
    
        // Fetch data
        $response = Http::get($url)->json();
        \Log::info('Overpass API Response:', $response); // ✅ Log response
    
        if (!isset($response['elements']) || empty($response['elements'])) {
            return response()->json(['error' => 'No towns found in OSM for this zone'], 404);
        }
    
        // Store or update towns
        foreach ($response['elements'] as $town) {
            if (isset($town['tags']['name'])) {
                Woreda::updateOrCreate(
                    ['osm_id' => $town['id']],
                    [
                        'name' => $town['tags']['name'],
                        'zone_id' => $zoneOsmId
                    ]
                );
            }
        }
    
        return response()->json(Woreda::where('zone_id', $zoneOsmId)->get());
    }
    
    
    
    
}

