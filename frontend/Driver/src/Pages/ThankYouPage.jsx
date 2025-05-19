import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "api";

const ThankYou = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const txRef = searchParams.get("tx_ref");
  const license = searchParams.get("license");
  const fineId = searchParams.get("fine_id");

  // First effect: verify payment
  useEffect(() => {
    if (!txRef) {
      setError("Missing transaction reference ❌");
      setLoading(false);
      return;
    }

    api
      .get(`/payment/verify?tx_ref=${txRef}`)
      .then((res) => {
        if (res.data.status === "success") {
          setStatus("Payment successful 🎉");
        } else {
          setError(res.data.message || "Payment failed ❌");
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Error verifying payment ❌");
      })
      .finally(() => setLoading(false));
  }, [txRef]);

  // Second effect: mark fine as paid after successful payment
  useEffect(() => {
    if (status === "Payment successful 🎉" && (license || fineId)) {
      api
        .put("/fines/pay", {
          license,
          fine_id: fineId,
        })
        .then((res) => {
          console.log("Fine marked as paid:", res.data);
        })
        .catch((err) => {
          console.error("Error updating fine status:", err);
        });
    }
  }, [status, license, fineId]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-green-50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-lg">
        <h1 className="mb-4 text-2xl font-bold text-green-600">Thank You!</h1>

        {loading && <p className="text-gray-500">Verifying payment...</p>}

        {!loading && error && (
          <p className="font-medium text-red-500">{error}</p>
        )}

        {!loading && status && (
          <>
            <p className="font-medium text-green-700">{status}</p>
            <p className="mt-2 text-sm text-gray-600">License: {license}</p>
            <p className="text-sm text-gray-600">Fine ID: {fineId}</p>
          </>
        )}

        <a
          href="/admin/incoming-penalty"
          className="mt-6 inline-block rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
        >
          Go Home
        </a>
      </div>
    </div>
  );
};

export default ThankYou;
