<?php

namespace App\Services\Payment;

use App\Models\PaymentSchedule;

interface PaymentServiceInterface
{
    public function recordPayment(PaymentSchedule $schedule, $request);
    public function getTransactions(PaymentSchedule $schedule);
}
