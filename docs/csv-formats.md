# CSV Format Documentation

This document describes the expected CSV formats for codes and attendees, based on the actual data structures used in production.

## Codes CSV Format

**Source**: Cursor referral system export  
**Expected filename pattern**: `Codes Sheet*.csv`

### Structure
```csv
https://cursor.com/referral?code=CODE123,Creator Name,Date,Role
https://cursor.com/referral?code=CODE456,Creator Name,Date,Role
```

### Example
```csv
https://cursor.com/referral?code=7E9E5B8Z1FJ,Alexander Zakharov,8/14/2025,Participant
https://cursor.com/referral?code=SUEHI0VGFWFY,Alexander Zakharov,8/14/2025,Participant
```

### Processing Logic
- Extract code from URL parameter using `url.searchParams.get('code')`
- Each line represents one available credit code
- The full URL is stored for direct redemption

---

## Attendees CSV Format

**Source**: Luma event management export  
**Expected filename pattern**: `*Guests*.csv`

### Key Headers (from 27 total columns)
```csv
api_id,name,first_name,last_name,email,phone_number,created_at,approval_status,custom_source,checked_in_at,...
```

### Important Fields
- `name` - Full attendee name
- `email` - Contact email address  
- `approval_status` - Must be "approved" to claim codes
- `checked_in_at` - Optional check-in timestamp

### Example Row
```csv
gst-69M3N8bFBRD31Sz,Lenz Zuber,Lenz,Zuber,a@le.nz,,2025-07-20T06:58:05.842Z,approved,,,
```

### Processing Logic
- Only process attendees with `approval_status === 'approved'`
- Use `name` and `email` for redemption matching
- Handle CSV fields with commas using proper quote parsing

---

## Data Volumes (from real files)
- **Codes**: ~120 cursor.com referral URLs
- **Attendees**: 244 total registrations, 194 approved
- **Format**: Standard CSV with quoted fields for complex data

---

## Security Notes
- Real CSV files contain sensitive data (emails, names, codes)
- Keep test files out of git repository
- Use `.gitignore` to exclude `test_files/` directory
- Structure documentation preserved here for development reference
