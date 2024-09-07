// import { useState } from "react";
// import styles from "./Request.module.css";
// import { useSelector } from "react-redux";
// import { useCreateRequestMutation,useGetRequestsBySalespersonQuery,useUpdateRequestStatusMutation } from "../../redux/api/requestApiSlice";


// const Request = () => {
//   const [newRequest, setNewRequest] = useState({
//     toId: "",
//     product: "",
//     message: "",
//   });
//   const user = useSelector((state) => state.auth.userInfo);

//   const { data: requests, isLoading, isError, refetch } = useGetRequestsBySalespersonQuery(user._id);
//   console.log(requests)
//   const [createRequest] = useCreateRequestMutation();
//   const [updateRequestStatus] = useUpdateRequestStatusMutation();

//   const handleStatusChange = async (requestId, newStatus) => {
//     try {
//       await updateRequestStatus({ id: requestId, status: newStatus });
//       refetch(); // Refetch the requests after updating
//     } catch (error) {
//       console.error("Failed to update request status:", error);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewRequest((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await createRequest({
//         fromId: user._id,
//         ...newRequest,
//       });
//       setNewRequest({ toId: "", product: "", message: "" });
//       refetch(); // Refetch the requests after creating a new one
//     } catch (error) {
//       console.error("Failed to create request:", error);
//     }
//   };

//   if (isLoading) return <div>Loading...</div>;
//   if (isError) return <div>Error loading requests</div>;

//   return (
//     <div className={styles.container}>
//       <h1 className={styles.title}>Sales App</h1>

//       <div className={styles.formContainer}>
//         <h2>Send New Request</h2>
//         <form onSubmit={handleSubmit} className={styles.form}>
//           <input
//             type="text"
//             name="toId"
//             value={newRequest.toId}
//             onChange={handleInputChange}
//             placeholder="Recipient ID"
//             required
//             className={styles.input}
//           />
//           <input
//             type="text"
//             name="product"
//             value={newRequest.product}
//             onChange={handleInputChange}
//             placeholder="Product"
//             required
//             className={styles.input}
//           />
//           <textarea
//             name="message"
//             value={newRequest.message}
//             onChange={handleInputChange}
//             placeholder="Message"
//             required
//             className={styles.textarea}
//           />
//           <button type="submit" className={styles.submitButton}>Send Request</button>
//         </form>
//       </div>

//       <div className={styles.requestsContainer}>
//         <h2>Incoming Requests</h2>
//         {requests && requests.map((request) => (
//           <div key={request._id} className={styles.requestCard}>
//             <p><strong>From:</strong> {request.from} ({request.from})</p>
//             <p><strong>Product:</strong> {request.product}</p>
//             <p><strong>Message:</strong> {request.message}</p>
//             <p><strong>Status:</strong> <span className={styles[request.status]}>{request.status}</span></p>
//             {request.status === "pending" && (
//               <div className={styles.buttonGroup}>
//                 <button
//                   onClick={() => handleStatusChange(request._id, "accepted")}
//                   className={styles.acceptButton}
//                 >
//                   Accept
//                 </button>
//                 <button
//                   onClick={() => handleStatusChange(request._id, "rejected")}
//                   className={styles.rejectButton}
//                 >
//                   Reject
//                 </button>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Request;

import { useState } from "react";
import styles from "./Request.module.css";
import { useSelector } from "react-redux";
import { 
  useCreateRequestMutation,
  useGetRequestsBySalespersonQuery,
  useUpdateRequestStatusMutation 
} from "../../redux/api/requestApiSlice";

const Request = () => {
  const [newRequest, setNewRequest] = useState({
    toId: "",
    product: "",
    message: "",
  });
  const user = useSelector((state) => state.auth.userInfo);

  const { data: requests, isLoading, isError, refetch } = useGetRequestsBySalespersonQuery(user._id);
  console.log(requests);
  const [createRequest] = useCreateRequestMutation();
  const [updateRequestStatus] = useUpdateRequestStatusMutation();

  const handleStatusChange = async (requestId, newStatus) => {
    try {
      await updateRequestStatus({ id: requestId, status: newStatus });
      refetch(); // Refetch the requests after updating
    } catch (error) {
      console.error("Failed to update request status:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRequest((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createRequest({
        fromId: user._id,
        ...newRequest,
      });
      setNewRequest({ toId: "", product: "", message: "" });
      refetch(); // Refetch the requests after creating a new one
    } catch (error) {
      console.error("Failed to create request:", error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading requests</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Sales App</h1>

      <div className={styles.formContainer}>
        <h2>Send New Request</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            name="toId"
            value={newRequest.toId}
            onChange={handleInputChange}
            placeholder="Recipient ID"
            required
            className={styles.input}
          />
          <input
            type="text"
            name="product"
            value={newRequest.product}
            onChange={handleInputChange}
            placeholder="Product"
            required
            className={styles.input}
          />
          <textarea
            name="message"
            value={newRequest.message}
            onChange={handleInputChange}
            placeholder="Message"
            required
            className={styles.textarea}
          />
          <button type="submit" className={styles.submitButton}>Send Request</button>
        </form>
      </div>

      <div className={styles.requestsContainer}>
        <h2>Incoming Requests</h2>
        {requests?.received && requests.received.map((request) => (
          <div key={request._id} className={styles.requestCard}>
            <p><strong>From:</strong> {request.from} ({request.from})</p>
            <p><strong>Product:</strong> {request.product}</p>
            <p><strong>Message:</strong> {request.message}</p>
            <p><strong>Status:</strong> <span className={styles[request.status]}>{request.status}</span></p>
            {request.status === "pending" && (
              <div className={styles.buttonGroup}>
                <button
                  onClick={() => handleStatusChange(request._id, "accepted")}
                  className={styles.acceptButton}
                >
                  Accept
                </button>
                <button
                  onClick={() => handleStatusChange(request._id, "rejected")}
                  className={styles.rejectButton}
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}

        <h2>Sent Requests</h2>
        {requests?.sent && requests.sent.map((request) => (
          <div key={request._id} className={styles.requestCard}>
            <p><strong>To:</strong> {request.to} ({request.to})</p>
            <p><strong>Product:</strong> {request.product}</p>
            <p><strong>Message:</strong> {request.message}</p>
            <p><strong>Status:</strong> <span className={styles[request.status]}>{request.status}</span></p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Request;
