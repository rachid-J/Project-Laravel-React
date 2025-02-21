<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class NotificationController extends Controller
{
  /**
     * Fetch notifications for the authenticated user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $myStore = auth('store')->user();
        
        $notifications = $myStore->notifications->map(function ($notification) {
            return [
                'id' => $notification->id,
                'message' => $notification->data['message'], // Access message from data
                'created_at' => $notification->created_at->toISOString(),
                'read' => $notification->read_at !== null,
            ];
        });
    
        return response()->json($notifications);
    }
    
    public function markAsRead(Request $request, $id)
    {
        $myStore = auth('store')->user();
        $notification = $myStore->notifications()->find($id);
    
        if ($notification) {
            $notification->markAsRead();
            return response()->json([
                'id' => $notification->id,
                'read' => true
            ]);
        }
    
        return response()->json(['message' => 'Notification not found'], 404);
    }
    /**
     * Delete a notification.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Request $request, $id)
    {
        $myStore = auth('store')->user();
        $notification = $myStore->notifications()->find($id);

        if ($notification) {
            $notification->delete();
            return response()->json(['message' => 'Notification deleted successfully']);
        }

        return response()->json(['message' => 'Notification not found'], 404);
    }
}
