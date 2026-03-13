<?php

Schedule::command('payments:update-statuses')->dailyAt('01:00');
Schedule::command('leases:update-statuses')->dailyAt('02:00');
Schedule::command('payments:send-reminders')->dailyAt('09:00');
Schedule::command('leases:generate-monthly-payments')->monthlyOn(1, '03:00');
