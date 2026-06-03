<!DOCTYPE html>
<html>
<body>
<p>Hi {{ $applicant_name }},</p>

<p>Your rental application has been received.</p>

<p>
    Property: {{ $property_name }}<br>
    Unit: {{ $unit_number }}<br>
    Submitted: {{ $submitted_at }}
</p>

<p>The property manager will review your application and notify you when a decision is made.</p>

<p>Thank you.</p>
</body>
</html>
