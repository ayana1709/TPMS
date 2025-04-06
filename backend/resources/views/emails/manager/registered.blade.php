@component('mail::message')
# Hello {{ $manager->name ?? $manager->username }},

🎉 Your manager account has been created successfully!

Here are your credentials:
- **Email:** {{ $manager->email }}
- **Region:** {{ $manager->region }}
- **Zone:** {{ $manager->zone }}
- **Town:** {{ $manager->woreda }}
- **Username:** {{ $manager->username }}
- **Password:** {{ $plainPassword }}

You can now login using the credentials above.

Thanks,<br>
{{ config('app.name') }}
@endcomponent
