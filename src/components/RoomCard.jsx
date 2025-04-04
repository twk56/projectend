import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  FormControlLabel,
  Switch,
  Box,
} from "@mui/material";
import { styled } from "@mui/system";
import dayjs from "dayjs";

const StyledRoomCard = styled(Card)(({ theme, status }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  borderRadius: "12px",
  border: `1px solid ${
    status === "available"
      ? theme.palette.success.main
      : theme.palette.error.main
  }`,
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  backgroundColor: status === "available" ? "#e8f5e9" : "#ffebee",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
  height: "100%",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
  },
}));

const RoomCard = ({
  room,
  booking,
  userId,
  role,
  getImageUrl,
  onCancelBooking,
  onStatusChange,
  onDelete,
  onClickImage,
}) => {
  const now = dayjs();
  const isBookingActive = booking && now.isBefore(dayjs(booking.endTime));
  const isRoomAvailable = !isBookingActive && room.status === "available";
  const hasBookingStarted = booking && now.isAfter(dayjs(booking.startTime));

  return (
    <StyledRoomCard status={room.status}>
      <CardMedia
        component="img"
        height="140"
        image={getImageUrl(room.image)}
        alt={`${room.name} Image`}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = `${
            import.meta.env.VITE_API_ORIGIN
          }/uploads/default.png`;
        }}
        sx={{
          objectFit: "cover",
          cursor: "pointer",
        }}
        onClick={() => {
            if (room.status === "available" && role !== "guest") {
              onClickImage();
            } else {
              // alert("กรุณาเข้าสู่ระบบ หรือ ห้องนี้ไม่พร้อมใช้งาน");
            }
          }}
      />
      <CardContent>
        <Typography
          variant="h5"
          align="center"
          fontWeight="bold"
          color={isRoomAvailable ? "success.main" : "error.main"}
        >
          {room.name}
        </Typography>

        {booking && hasBookingStarted ? (
          <Box
            sx={{ mt: 1, p: 1, backgroundColor: "#fffde7", borderRadius: 1 }}
          >
            <Typography variant="subtitle2" fontWeight="bold">
              ข้อมูลการเข้าใช้งาน
            </Typography>
            <Typography variant="body2">
              ชื่อผู้ใช้งาน: {booking.user?.fullName}
            </Typography>
            <Typography variant="body2">
              เวลา: {dayjs(booking.startTime).format("HH:mm")} -{" "}
              {dayjs(booking.endTime).format("HH:mm")}
            </Typography>
            <Typography variant="body2">
              วันที่: {dayjs(booking.startTime).format("DD MMM YYYY")}
            </Typography>

            {(role === "admin" ||
              (role === "user" && booking.user?._id === userId)) && (
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => onCancelBooking(booking._id)}
                sx={{ mt: 1 }}
              >
                ยกเลิกการจอง
              </Button>
            )}
          </Box>
        ) : (
          <Typography variant="body2" align="center" mt={1}>
            {room.status === "unavailable" ? "ห้องนี้ถูกปิด" : ""}
          </Typography>
        )}

        {role === "admin" && (
          <>
            <FormControlLabel
              control={
                <Switch
                  checked={room.status === "available"}
                  onChange={() =>
                    onStatusChange(
                      room._id,
                      room.status === "available" ? "unavailable" : "available"
                    )
                  }
                />
              }
              label={room.status === "available" ? "เปิด" : "ปิด"}
              sx={{ mt: 2 }}
            />
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => onDelete(room._id)}
              sx={{ mt: 1 }}
            >
              ลบห้อง
            </Button>
          </>
        )}
      </CardContent>
    </StyledRoomCard>
  );
};

export default RoomCard;
