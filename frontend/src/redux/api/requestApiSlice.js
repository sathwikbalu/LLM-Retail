import { apiSlice } from "./apiSlice";
import { REQUEST_URL } from "../constants";


export const requestApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createRequest: builder.mutation({
      query: (requestData) => ({
        url: `${REQUEST_URL}`,
        method: 'POST',
        body: requestData,
      }),
      invalidatesTags: ['Request'],
    }),

    getRequestsBySalesperson: builder.query({
      query: (salesPersonId) => `${REQUEST_URL}/${salesPersonId}`,
      providesTags: ['Request'],
    }),

    updateRequestStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `${REQUEST_URL}/${id}`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['Request'],
    }),
  }),
});

export const {
  useCreateRequestMutation,
  useGetRequestsBySalespersonQuery,
  useUpdateRequestStatusMutation,
} = requestApiSlice;