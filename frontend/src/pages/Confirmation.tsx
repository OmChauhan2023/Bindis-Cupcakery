import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function ConfirmationPage() {
  const navigate = useNavigate();

  // Automatically redirect to home after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 5000); // Redirect after 5 sec
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="max-w-3xl mx-auto p-6 text-center" style={{ padding: "60px 20px" }}>
      <h2 className="text-3xl font-bold text-green-600 mb-4" style={{ fontSize: "2rem", color: "#059669", marginBottom: "16px", fontWeight: "bold" }}>
        ✅ Order Placed Successfully!
      </h2>
      <p className="text-lg text-gray-700" style={{ fontSize: "1.125rem", color: "#374151" }}>
        Thank you for your order! We&apos;ll start preparing it soon.
      </p>
      <p className="text-sm text-gray-500 mt-2" style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "8px" }}>
        You will be redirected to the homepage shortly...
      </p>

      <Link
        to="/"
        style={{
          marginTop: "24px",
          display: "inline-block",
          backgroundColor: "#ec4899",
          color: "white",
          padding: "10px 24px",
          borderRadius: "50px",
          textDecoration: "none",
          fontWeight: "bold",
          boxShadow: "0 4px 12px rgba(236, 72, 153, 0.3)",
        }}
      >
        Go to Home Now
      </Link>
    </div>
  );
}
