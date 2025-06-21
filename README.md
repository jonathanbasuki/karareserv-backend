# 📘 KaraReserv Backend API

This is a RESTful API for managing karaoke rooms, bookings, and payments in **KaraReserv Mobile App**.

---

## 📦 Services Overview

| Service | Description                                                     |
| ------- | --------------------------------------------------------------- |
| Room    | Manage room information and images                              |
| Booking | Create, update, cancel room bookings with auto total price calc |
| Payment | Manage payments for bookings with sync to booking status        |

---

## 🎤 Room Service

### 📌 Endpoints

#### `GET /rooms`

Get all rooms with only one image per room.

**Response:**

```json
[
  {
    "room_uuid": "uuid-1",
    "room_number": "A101",
    "room_type": "Deluxe",
    "room_capacity": 10,
    "room_description": "Spacious room",
    "room_status": "available",
    "hourly_rate": 100000,
    "image": "uploads/image1.jpg"
  }
]
```

---

#### `GET /rooms/:uuid`

Get detailed room info with all images.

**Response:**

```json
{
  "room_uuid": "uuid-1",
  "room_number": "A101",
  "room_type": "Deluxe",
  "room_capacity": 10,
  "room_description": "Spacious room",
  "room_status": "available",
  "hourly_rate": 100000,
  "images": ["uploads/image1.jpg", "uploads/image2.jpg"]
}
```

---

#### `POST /rooms`

Create a room with image upload.

**Request:**

```http
POST /rooms
Content-Type: multipart/form-data
```

**Form Fields:** (as form-data)

```
room_number=A101
room_type=Deluxe
room_capacity=10
room_description=Spacious room
hourly_rate=150000
images[]=[file1.jpg, file2.jpg]
```

**Response:**

```json
{ "message": "Room created successfully" }
```

---

#### `DELETE /rooms/:uuid`

Delete room and its images.

```http
DELETE /rooms/uuid-1
```

**Response:**

```json
{ "message": "Room deleted successfully" }
```

---

## 📅 Booking Service

### 📌 Endpoints

#### `POST /bookings`

Create new booking. Auto generates `total_price`.

**Request:**

```http
POST /bookings
Content-Type: application/json
```

**Body:**

```json
{
  "room_uuid": "uuid-1",
  "user_uuid": "user-abc",
  "booking_date": "2025-06-28",
  "start_time": "09:00",
  "end_time": "12:00"
}
```

**Response:**

```json
{
  "booking_uuid": "booking-xyz",
  "total_price": 450000,
  "booking_status": "pending"
}
```

---

#### `PUT /bookings/:uuid`

Update booking if status is `pending`, auto update total price.

**Request:**

```http
PUT /bookings/booking-xyz
Content-Type: application/json
```

**Body:**

```json
{
  "start_time": "10:00",
  "end_time": "13:00"
}
```

**Response:**

```json
{
  "message": "Booking updated successfully",
  "total_price": 450000
}
```

---

#### `DELETE /bookings/:uuid`

Cancel a pending booking.

```http
DELETE /bookings/booking-xyz
```

**Response:**

```json
{
  "message": "Booking status set to cancelled and payment deleted successfully"
}
```

---

## 💳 Payment Service

### 📌 Endpoints

#### `PUT /payments/:booking_uuid`

Update payment info & mark as paid.

**Request:**

```http
PUT /payments/booking-xyz
Content-Type: application/json
```

**Body:**

```json
{
  "payment_method": "qris",
  "payment_status": "paid"
}
```

**Response:**

```json
{ "message": "Payment updated successfully" }
```

---

#### `GET /payments/:user_uuid`

Get payment list with room and booking details flattened.

```http
GET /payments/user-abc
```

**Response:**

```json
[
  {
    "payment_uuid": "pay-123",
    "booking_uuid": "booking-xyz",
    "payment_date": "2025-06-28T10:00:00.000Z",
    "amount": 450000,
    "payment_method": "qris",
    "payment_status": "paid",
    "booking_date": "2025-06-28",
    "start_time": "10:00",
    "end_time": "13:00",
    "booking_status": "confirmed",
    "room_type": "Deluxe"
  }
]
```

---

## 🔐 Notes

- Soft delete is enabled on `Booking` and `Payment` using `paranoid: true`
- All UUIDs generated with `UUIDV4`
- Image upload handled in `uploads/` folder
