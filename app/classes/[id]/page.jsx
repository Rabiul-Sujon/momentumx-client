"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import axios from "@/lib/axios";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
// import Image from "next/image";

export default function ClassDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  // Fetch class details
  const { data: cls, isLoading } = useQuery({
    queryKey: ["class", id],
    queryFn: () => axios.get(`/api/classes/${id}`).then((r) => r.data),
  });

  // Check if already booked
  const { data: bookingCheck } = useQuery({
    queryKey: ["booking-check", id],
    queryFn: () => axios.get(`/api/bookings/check/${id}`).then((r) => r.data),
    enabled: !!user,
  });

  // Check if already favorited
const { data: favoriteCheck } = useQuery({
  queryKey: ["favorite-check", id],
  queryFn: () => axios.get(`/api/favorites/check/${id}`).then((r) => r.data),
  enabled: !!user,
});

console.log("favoriteCheck:", favoriteCheck);
const isBooked = bookingCheck?.booked; 
const isFavorited = favoriteCheck?.favorited;
const favoriteId = favoriteCheck?.favoriteId;

  
 // Add favorite mutation
const addFavoriteMutation = useMutation({
  mutationFn: () => axios.post("/api/favorites", {
    classId: cls._id,
    className: cls.name,
    trainerName: cls.trainerName,
    category: cls.category,
    price: cls.price,
    image: cls.image,
  }),
  onSuccess: () => {
    toast.success("Added to favorites!");
    queryClient.invalidateQueries(["favorite-check", id]);
  },
  onError: (err) => {
    toast.error(err?.response?.data?.message || "Failed to add favorite");
  },
});

 // Remove favorite mutation
const removeFavoriteMutation = useMutation({
  mutationFn: async () => {
    if (!favoriteId) {
      throw new Error("Favorite ID not found");
    }
    return axios.delete(`/api/favorites/${favoriteId}`);
  },
  onSuccess: () => {
    toast.success("Removed from favorites!");
    queryClient.invalidateQueries(["favorite-check", id]);
  },
  onError: (err) => {
    toast.error(err?.response?.data?.message || "Failed to remove favorite");
  },
});

  const handleBookNow = () => {
    if (!user) return router.push("/login");
    if (isBooked) return toast.error("You have already booked this class");
    router.push(`/payment?classId=${id}`);
  };

 const handleFavorite = () => {
  if (!user) return router.push("/login");
  
  if (isFavorited) {
    if (!favoriteId) {
      toast.error("Cannot remove favorite: ID not found");
      return;
    }
    removeFavoriteMutation.mutate();
  } else {
    addFavoriteMutation.mutate();
  }
};

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0A0F1E" }}>
        <span className="loading loading-spinner loading-lg" style={{ color: "#00D4FF" }}></span>
      </div>
    );
  }

  if (!cls) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0A0F1E" }}>
        <p className="text-white text-xl">Class not found.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen py-16 px-4" style={{ background: "#0A0F1E", fontFamily: "DM Sans, sans-serif" }}>
      <div className="max-w-5xl mx-auto">

        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 mb-8 text-sm transition-opacity hover:opacity-70"
          style={{ color: "#00D4FF" }}
        >
          ← Back to Classes
        </button>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-10"
        >
          {/* Image */}
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(0,212,255,0.15)" }}>
            <img
              src={cls.image}
              alt={cls.name}
              className="w-full h-80 lg:h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col justify-between gap-6">
            {/* Header */}
            <div>
              <span
                className="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4 inline-block"
                style={{ background: "rgba(123,47,255,0.2)", color: "#7B2FFF", border: "1px solid rgba(123,47,255,0.3)" }}
              >
                {cls.category}
              </span>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mt-2 mb-1">{cls.name}</h1>
              <p className="text-sm" style={{ color: "#00D4FF" }}>
                by <span className="font-semibold">{cls.trainerName}</span>
              </p>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Price", value: `$${cls.price}` },
                { label: "Duration", value: cls.duration },
                { label: "Difficulty", value: cls.difficultyLevel },
                { label: "Bookings", value: cls.bookingCount ?? 0 },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl p-4"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>{item.label}</p>
                  <p className="text-white font-semibold text-lg">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Schedule */}
            {cls.schedule && (
              <div
                className="rounded-xl p-4"
                style={{ background: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.15)" }}
              >
                <p className="text-xs mb-2 font-semibold uppercase tracking-wider" style={{ color: "#00D4FF" }}>
                  Schedule
                </p>
                <p className="text-white text-sm">{cls.schedule.days} &mdash; {cls.schedule.time}</p>
              </div>
            )}

            {/* Description */}
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
              {cls.description}
            </p>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {/* Book Now */}
              <button
                onClick={handleBookNow}
                disabled={isBooked}
                className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all duration-200"
                style={{
                  background: isBooked
                    ? "rgba(255,255,255,0.08)"
                    : "linear-gradient(135deg, #00D4FF, #7B2FFF)",
                  color: isBooked ? "rgba(255,255,255,0.3)" : "#fff",
                  cursor: isBooked ? "not-allowed" : "pointer",
                  border: isBooked ? "1px solid rgba(255,255,255,0.1)" : "none",
                }}
              >
                {isBooked ? "✓ Already Booked" : "Book Now"}
              </button>

              {/* Favorite */}
              <button
                onClick={handleFavorite}
                disabled={addFavoriteMutation.isPending || removeFavoriteMutation.isPending}
                className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all duration-200"
                style={{
                  background: isFavorited ? "rgba(123,47,255,0.2)" : "rgba(255,255,255,0.05)",
                  color: isFavorited ? "#7B2FFF" : "rgba(255,255,255,0.6)",
                  border: isFavorited ? "1px solid rgba(123,47,255,0.4)" : "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {isFavorited ? "♥ Saved to Favorites" : "♡ Add to Favorites"}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}