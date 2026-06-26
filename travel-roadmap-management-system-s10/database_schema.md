# Travel Roadmap Management System Database Schema

## Database Name
travel_roadmap_db

### Users Collection

| Field | Type |
|--------|------|
| _id | ObjectId |
| name | String |
| email | String |
| password | String |
| phone | String |
| role | String |

### Trips Collection

| Field | Type |
|--------|------|
| _id | ObjectId |
| user_id | String |
| trip_name | String |
| start_date | Date |
| end_date | Date |
| status | String |

### Destinations Collection

| Field | Type |
|--------|------|
| _id | ObjectId |
| trip_id | String |
| destination_name | String |
| city | String |
| country | String |

### Itineraries Collection

| Field | Type |
|--------|------|
| _id | ObjectId |
| trip_id | String |
| day | Number |
| activity | String |
| time | String |

### Hotel Bookings Collection

| Field | Type |
|--------|------|
| _id | ObjectId |
| trip_id | String |
| hotel_name | String |
| check_in | Date |
| check_out | Date |
| status | String |

### Transport Bookings Collection

| Field | Type |
|--------|------|
| _id | ObjectId |
| trip_id | String |
| transport_type | String |
| source | String |
| destination | String |

### Activities Collection

| Field | Type |
|--------|------|
| _id | ObjectId |
| trip_id | String |
| activity_name | String |
| location | String |
| time | String |

### Expenses Collection

| Field | Type |
|--------|------|
| _id | ObjectId |
| trip_id | String |
| category | String |
| amount | Number |
| date | Date |

### Notifications Collection

| Field | Type |
|--------|------|
| _id | ObjectId |
| user_id | String |
| message | String |
| status | String |

### Reviews Collection

| Field | Type |
|--------|------|
| _id | ObjectId |
| trip_id | String |
| rating | Number |
| review | String |
