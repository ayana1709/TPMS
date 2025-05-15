import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "api";
// import axios from "axios";

const ThankYou = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);
  console.log(status);
  const [error, setError] = useState(null);
  const txRef = searchParams.get("tx_ref");

  console.log("TX_REF:", txRef); // ✅ should print your tx_ref

  useEffect(() => {
    if (txRef) {
      api
        .get(`/payment/verify?tx_ref=${txRef}`)
        .then((res) => {
          if (res.data.status === "success") {
            setStatus("Payment successful 🎉");
          } else {
            setError("Payment not success ❌");
          }
        })
        .catch((err) => {
          console.error(err);
          setError("Error verifying payment ❌");
        })
        .finally(() => setLoading(false));
    }
  }, [txRef]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-green-50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-lg">
        <h1 className="mb-4 text-2xl font-bold text-green-600">Thank You!</h1>
        {loading && <p className="text-gray-500">Verifying payment...</p>}
        {!loading && status && (
          <p className="font-medium text-green-700">{status}</p>
        )}
        {!loading && error && (
          <p className="font-medium text-red-500">{error}</p>
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
