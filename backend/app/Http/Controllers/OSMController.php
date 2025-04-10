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
    
        $response = Http::withOptions([
            'verify' => false
        ])->get($url)->json();
    
        foreach ($response['elements'] as $region) {
            Region::updateOrCreate([
                'osm_id' => $region['id']
            ], [
                'name' => $region['tags']['name']
            ]);
        }
    
        return response()->json(Region::all());
    }
    

    public function fetchZones($regionOsmId) {
        $areaId = 3600000000 + $regionOsmId;
    
        $url = "https://overpass-api.de/api/interpreter?data=[out:json];area($areaId)->.region;
        (
          relation[\"admin_level\"=\"5\"](area.region);
        );
        out body;";
    
        $response = Http::withOptions(['verify' => false])->get($url)->json();
    
        if (!isset($response['elements'])) {
            return response()->json(['error' => 'No zones found'], 404);
        }
    
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
    
        return response()->json(Zone::where('region_id', $regionOsmId)->get());
    }
    
    

    public function fetchTowns($zoneOsmId) {
        $areaId = 3600000000 + $zoneOsmId;
    
        $url = "https://overpass-api.de/api/interpreter?data=[out:json];
        area($areaId)->.zone;
        (
          node[\"place\"=\"town\"](area.zone);
          node[\"place\"=\"city\"](area.zone);
          node[\"place\"=\"village\"](area.zone);
        );
        out body;";
    
        $response = Http::withOptions(['verify' => false])->get($url)->json();
    
        \Log::info('Overpass API Response:', $response);
    
        if (!isset($response['elements']) || empty($response['elements'])) {
            return response()->json(['error' => 'No towns found in OSM for this zone'], 404);
        }
    
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

