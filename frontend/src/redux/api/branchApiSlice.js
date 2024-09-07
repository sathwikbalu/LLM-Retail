import { apiSlice } from "./apiSlice";
import { BRANCH_URL } from "../constants";

export const BranchApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createBranch: builder.mutation({
      query: (newBranch) => ({
        url: `${BRANCH_URL}`,
        method: "POST",
        body: newBranch,
      }),
    }),

    updateBranch: builder.mutation({
      query: ({ BranchId, updatedBranch }) => ({
        url: `${BRANCH_URL}/${BranchId}`,
        method: "PUT",
        body: updatedBranch,
      }),
    }),

    deleteBranch: builder.mutation({
      query: (BranchId) => ({
        url: `${BRANCH_URL}/${BranchId}`,
        method: "DELETE",
      }),
    }),

    fetchBranchs: builder.query({
      query: () => `${BRANCH_URL}/branchs`,
    }),
  }),
});

export const {
  useCreateBranchMutation,
  useUpdateBranchMutation,
  useDeleteBranchMutation,
  useFetchBranchsQuery,
} = BranchApiSlice;
