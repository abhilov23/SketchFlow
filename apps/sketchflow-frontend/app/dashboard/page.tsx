"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shapes, PlusCircle, LogOut, Calendar, Hash, Trash2, DoorOpen } from "lucide-react";
import { CreateRoomSchema } from "@repo/common/types";

// Custom CSS with new button styles
const customStyles = `
  .bg-gradient {
    background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
  }
  .shadow-glow {
    box-shadow: 0 4px 20px rgba(255, 255, 255, 0.1);
  }
  .hover-glow:hover {
    box-shadow: 0 6px 25px rgba(255, 255, 255, 0.15);
  }
  .animate-float-subtle {
    animation: floatSubtle 6s ease-in-out infinite;
  }
  @keyframes floatSubtle {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  .animate-fade-in {
    animation: fadeIn 0.5s ease-in-out;
  }
  @keyframes fadeIn {
    0% { opacity: 0; transform: translateY(10px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  .header {
    background: rgba(17, 24, 39, 0.9);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  .footer {
    background: rgba(17, 24, 39, 0.9);
    backdrop-filter: blur(10px);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
  .btn-primary {
    background: linear-gradient(90deg, #4b5563 0%, #6b7280 100%);
    color: white;
    font-weight: 600;
    letter-spacing: 0.025em;
    padding: 0.75rem 1.5rem;
    border-radius: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
  }
  .btn-primary:hover {
    background: linear-gradient(90deg, #6b7280 0%, #9ca3af 100%);
    transform: scale(1.05);
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
  }
  .btn-primary:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
  }
  .btn-primary:active {
    transform: scale(0.95);
  }
  .btn-primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .btn-outline {
    border: 2px solid #6b7280;
    color: white;
    font-weight: 600;
    letter-spacing: 0.025em;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    background: transparent;
    transition: all 0.3s ease;
  }
  .btn-outline:hover {
    background: rgba(107, 114, 128, 0.2);
    transform: scale(1.05);
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
  }
  .btn-open {
    background: linear-gradient(90deg, #10b981 0%, #34d399 100%);
    color: white;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    transition: all 0.3s ease;
  }
  .btn-open:hover {
    background: linear-gradient(90deg, #34d399 0%, #6ee7b7 100%);
    transform: scale(1.05);
    box-shadow: 0 0 15px rgba(110, 231, 183, 0.3);
  }
  .btn-delete {
    background: linear-gradient(90deg, #ef4444 0%, #f87171 100%);
    color: white;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    transition: all 0.3s ease;
  }
  .btn-delete:hover {
    background: linear-gradient(90deg, #f87171 0%, #fca5a5 100%);
    transform: scale(1.05);
    box-shadow: 0 0 15px rgba(248, 113, 113, 0.3);
  }
  .input-field {
    background: #2d3748;
    color: white;
    border: none;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    transition: all 0.3s ease;
  }
  .input-field:focus {
    outline: none;
    box-shadow: 0 0 5px rgba(255, 255, 255, 0.3);
    background: #374151;
  }
  .input-field::placeholder {
    color: #a0aec0;
  }
  .error-text {
    color: #f87171;
    font-size: 0.875rem;
    margin-top: 0.25rem;
  }
  .success-text {
    color: #34d399;
    font-size: 0.875rem;
    text-align: center;
    margin-top: 1rem;
  }
  .room-card {
    background: #2d3748;
    padding: 1.5rem;
    border-radius: 1rem;
    transition: all 0.3s ease;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  .room-card:hover {
    background: #374151;
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(255, 255, 255, 0.15);
  }
  .room-card-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #e5e7eb;
  }
  .room-card-meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #9ca3af;
    font-size: 0.875rem;
  }
`;

export default function Dashboard() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signin");
    } else {
      setIsAuthenticated(true);
      fetchRooms(token);
    }
  }, [router]);

  // Periodic refresh of rooms every 30 seconds
  useEffect(() => {
    if (!isAuthenticated) return;

    const token = localStorage.getItem("token");
    const interval = setInterval(() => {
      fetchRooms(token);
    }, 30000); // 30 seconds

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Fetch rooms for the user
  const fetchRooms = async (token) => {
    try {
      const response = await fetch("http://localhost:3005/rooms", {
        headers: {
          Authorization: `${token}`, 
        },
      });
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 403) {
          localStorage.removeItem("token");
          router.push("/signin");
          return;
        }
        throw new Error(data.message || "Failed to fetch rooms");
      }
      setRooms(data.room || []);
    } catch (error) {
      console.error("Fetch rooms error:", error);
      setErrors({ general: "Failed to load rooms" });
    }
  };

  // Handle room creation
  const handleCreateRoom = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setSuccessMessage("");

    // Validate with Zod
    const result = CreateRoomSchema.safeParse({ name });
    if (!result.success) {
      const fieldErrors = {};
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3005/room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`, // Fixed: Ensure Bearer prefix
        },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();
      if (!response.ok) {
        if (response.status === 403) {
          localStorage.removeItem("token");
          router.push("/signin");
          return;
        }
        throw new Error(data.message || "Failed to create room");
      }

      setSuccessMessage("Room created successfully!");
      setName("");
      fetchRooms(token); // Refresh the room list
    } catch (error) {
      setErrors({ general: error.message || "Failed to create room" });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle room deletion
  const handleDeleteRoom = async (slug: string) => {
    if (!confirm(`Are you sure you want to delete the room "${slug}"?`)) return;
    
    try {
      
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3005/room/${slug}`, {
        method: "DELETE",
        headers: {
          Authorization: `${token}`,
        }
      });

      const data = await response.json();
      if (!response.ok) {
        if (response.status === 403) {
          localStorage.removeItem("token");
          router.push("/signin");
          return;
        }
        throw new Error(data.message || "Failed to delete room");
      }

      setSuccessMessage("Room deleted successfully!");
      fetchRooms(token); // Refresh the room list
    } catch (error) {
      setErrors({ general: error.message || "Failed to delete room" });
    }
  };

  // Handle room opening
  const handleOpenRoom = (id: number) => {
    router.push(`/canvas/${id}`);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/signin");
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-300"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient text-white">
      <style>{customStyles}</style>

      {/* Background Decorative Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gray-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-float-subtle opacity-30"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gray-400/20 rounded-full blur-3xl translate-x-1/2 animate-float-subtle opacity-30" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-gray-300/20 rounded-full blur-3xl animate-float-subtle opacity-30" style={{ animationDelay: "2s" }}></div>
      </div>

      {/* Header */}
      <header className="header px-4 lg:px-6 h-16 flex items-center justify-between z-10">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gray-500 flex items-center justify-center text-white shadow-glow hover-glow transition-all">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5v-2l-10 5-10-5v2zM2 12l10 5 10-5v-2l-10 5-10-5v2z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-white">SketchFlow</span>
        </Link>
        <div className="flex items-center gap-4">
          <button onClick={handleLogout} className="btn-outline flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="container px-4 py-12 mx-auto max-w-4xl">
          <div className="space-y-12">
            {/* Dashboard Header */}
            <div className="text-center space-y-4 animate-fade-in">
              <h1 className="text-5xl font-extrabold tracking-tight text-white">
                Your Dashboard
              </h1>
              <p className="text-gray-300 text-lg">
                Create new rooms and manage your existing ones with ease.
              </p>
            </div>

            {/* Create Room Form */}
            <div className="p-8 bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-glow hover-glow transition-all duration-300 animate-fade-in">
              <form onSubmit={handleCreateRoom} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Room Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter a name for your room"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full input-field"
                  />
                  {errors.name && <p className="error-text">{errors.name}</p>}
                </div>

                <button type="submit" disabled={isLoading} className="w-full btn-primary">
                  <PlusCircle className="h-5 w-5" />
                  {isLoading ? "Creating..." : "Create Room"}
                </button>

                {errors.general && <p className="error-text">{errors.general}</p>}
                {successMessage && <p className="success-text">{successMessage}</p>}
              </form>
            </div>

            {/* List of Rooms */}
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-3xl font-bold text-white">Your Rooms</h2>
              {rooms.length === 0 ? (
                <div className="text-center py-12 bg-gray-900/50 rounded-2xl">
                  <p className="text-gray-400 text-lg">No rooms created yet. Start by creating one above!</p>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {rooms.map((room, index) => (
                    <div key={room.slug} className="room-card animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                      <div className="space-y-3">
                        <div className="room-card-header">
                          <h3 className="text-xl font-semibold text-white">{room.name || room.slug}</h3>
                        </div>
                        <div className="room-card-meta">
                          <Hash className="h-4 w-4" />
                          <span>Slug: {room.slug}</span>
                        </div>
                        <div className="room-card-meta">
                          <Calendar className="h-4 w-4" />
                          <span>Created: {new Date(room.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => handleOpenRoom(room.id)}
                            className="btn-open flex-1"
                          >
                            <DoorOpen className="h-4 w-4" />
                            Open
                          </button>
                          <button
                            onClick={() => handleDeleteRoom(room.slug)}
                            className="btn-delete flex-1"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gray-500 flex items-center justify-center text-white shadow-glow hover-glow transition-all">
            <Shapes className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold text-white">SketchFlow</span>
        </div>
        <p className="text-xs text-gray-400 sm:ml-auto">
          © {new Date().getFullYear()} SketchFlow. All rights reserved.
        </p>
        <nav className="flex gap-4 sm:gap-6">
          <Link href="/terms" className="text-xs text-gray-400 hover:text-white transition-colors duration-300">
            Terms
          </Link>
          <Link href="/privacy" className="text-xs text-gray-400 hover:text-white transition-colors duration-300">
            Privacy
          </Link>
          <Link href="/contact" className="text-xs text-gray-400 hover:text-white transition-colors duration-300">
            Contact
          </Link>
        </nav>
      </footer>
    </div>
  );
}