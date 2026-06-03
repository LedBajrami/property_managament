<!DOCTYPE html>
<html>
<body>
<p>Hi {{ $applicant_name }},</p>

<p>Your rental application for {{ $property_name }}, Unit {{ $unit_number }}, was not approved.</p>

<p>Reason: {{ $rejection_reason }}</p>

<p>Thank you.</p>
</body>
</html>
