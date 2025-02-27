<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Order;
use App\Models\Product;
use App\Models\Sell;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function getData()
    {
        $store = auth('store')->user();
        if (!$store) {
            return response()->json([
                "message" => "Unauthorized: You do not own this store.",
            ], 401);
        }
        $totalSales = Sell::count();
        $totalCustomers = Customer::count();
        $totalProducts = Product::count();
        $totalOrders = Order::count();

        return response()->json([
            'totalSales' => $totalSales,
            'totalCustomers' => $totalCustomers,
            'totalProducts' => $totalProducts,
            'totalOrders' => $totalOrders,
        ]);
    }
    
    public function getsellsChart()
    {
        $store = auth('store')->user();
        if (!$store) {
            return response()->json([
                "message" => "Unauthorized: You do not own this store.",
            ], 401);
        }
        $sells = Sell::all();
        $data = [];
    
        foreach ($sells as $sell) {
            $day = $sell->created_at->format('D'); // Format the date to get the day of the week
    
            if (!isset($data[$day])) {
                $data[$day] = [
                    'day' => $day,
                    'Sold' => 0,
                    'Returned' => 0,
                    'pending' => 0,
                ];
            }
    
            if ($sell->status === 'Sold') {
                $data[$day]['Sold']++;
            } elseif ($sell->status === 'Returned') {
                $data[$day]['Returned']++;
            } elseif ($sell->status === 'pending') {
                $data[$day]['pending']++;
            }
        }
    
        // Reindex the array to ensure it's a sequential array
        $data = array_values($data);
    
        return response()->json($data);
    }

    public function	getOrderschart(){
        $store = auth('store')->user();
        if (!$store) {
            return response()->json([
                "message" => "Unauthorized: You do not own this store.",
            ], 401);
        }
        $orders = Order::all();
        $data = [];
    
        foreach ($orders as $order) {
            $day = $order->created_at->format('D'); // Format the date to get the day of the week
    
            if (!isset($data[$day])) {
                $data[$day] = [
                    'day' => $day,
                    'Paid' => 0,
                    'Cancelled' => 0,
                    'pending' => 0,
                ];
            }
    
            if ($order->status === 'Paid') {
                $data[$day]['Paid']++;
            } elseif ($order->status === 'Cancelled') {
                $data[$day]['Cancelled']++;
            } elseif ($order->status === 'pending') {
                $data[$day]['pending']++;
            }
        }
    
        // Reindex the array to ensure it's a sequential array
        $data = array_values($data);
    
        return response()->json($data);
    }
}
