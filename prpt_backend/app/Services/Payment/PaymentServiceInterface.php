<?php

namespace App\Services\Payment;

use App\Models\PaymentSchedule;
use Illuminate\Http\Request;

interface PaymentServiceInterface
{
    public function getPaymentSchedules(Request $request);

    public function getMyPaymentSchedules(Request $request);

    public function recordPayment(PaymentSchedule $schedule, $request);

    public function getTransactions(PaymentSchedule $schedule);
}
