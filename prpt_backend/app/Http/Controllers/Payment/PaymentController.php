<?php

namespace App\Http\Controllers\Payment;

use App\Http\Controllers\Controller;
use App\Http\Requests\Payment\RecordPaymentRequest;
use App\Models\PaymentSchedule;
use App\Services\Payment\PaymentService;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function __construct(protected PaymentService $paymentService)
    {
    }

    public function getPaymentSchedules(Request $request)
    {
        return $this->paymentService->getPaymentSchedules($request);
    }

    public function getMyPaymentSchedules(Request $request)
    {
        return $this->paymentService->getMyPaymentSchedules($request);
    }

    public function recordPayment(RecordPaymentRequest $request, PaymentSchedule $paymentSchedule)
    {
        return $this->paymentService->recordPayment($paymentSchedule, $request);
    }

    public function getTransactions(PaymentSchedule $paymentSchedule)
    {
        return $this->paymentService->getTransactions($paymentSchedule);
    }
}
