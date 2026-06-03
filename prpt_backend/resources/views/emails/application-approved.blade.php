<!DOCTYPE html>
<html>
<body>
<p>Hi {{ $applicant_name }},</p>

<p>Your rental application has been approved.</p>

<p>
    Property: {{ $property_name }}<br>
    Unit: {{ $unit_number }}<br>
    Lease dates: {{ $lease_start_date }} to {{ $lease_end_date }}
</p>

<p>A draft lease has been created. The property manager will follow up with the next steps.</p>

<p>Thank you.</p>
</body>
</html>
