import { useState } from "react";
import { toast } from "react-toastify";
import {
  useCreateBranchMutation,
  useUpdateBranchMutation,
  useDeleteBranchMutation,
  useFetchBranchsQuery,
} from "../../redux/api/branchApiSlice.js";
import CategoryForm from "../../components/CategoryForm.jsx";
import Modal from "../../components/Modal.jsx";


const BranchList = () => {
  const { data: categories } = useFetchBranchsQuery();
  //console.log(categories)
  const [name, setName] = useState("");
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [updatingName, setUpdatingName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const [createBranch] = useCreateBranchMutation();
  const [updateBranch] = useUpdateBranchMutation();
  const [deleteBranch] = useDeleteBranchMutation();

  const handleCreateBranch = async (e) => {
    e.preventDefault();

    if (!name) {
      toast.error("Branch name is required");
      return;
    }

    try {
      const result = await createBranch({ name }).unwrap();
      if (result.error) {
        toast.error(result.error);
      } else {
        setName("");
        toast.success(`${result.name} is created.`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Creating Branch failed, try again.");
    }
  };

  const handleUpdateBranch = async (e) => {
    e.preventDefault();

    if (!updatingName) {
      toast.error("Branch name is required");
      return;
    }

    try {
      const result = await updateBranch({
        branchId: selectedBranch._id,
        updatedBranch: {
          name: updatingName,
        },
      }).unwrap();

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${result.name} is updated`);
        setSelectedBranch(null);
        setUpdatingName("");
        setModalVisible(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteBranch = async () => {
    try {
      const result = await deleteBranch(selectedBranch._id).unwrap();

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${result.name} is deleted.`);
        setSelectedBranch(null);
        setModalVisible(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Branch deletion failed. Try again.");
    }
  };

  return (
    <div className="ml-[10rem] flex flex-col md:flex-row">
      <div className="md:w-3/4 p-3">
        <div className="h-12">Manager Categories</div>
        <CategoryForm
          value={name}
          setValue={setName}
          handleSubmit={handleCreateBranch}
        />
        <br />
        <hr />

        <div className="flex flex-wrap">
          {" "}
          {categories?.map((branch) => (
            <div key={branch._id}>
              <button
                className="bg-white border border-pink-500 text-pink-500 py-2 px-4 rounded-lg m-3 hover:bg-pink-500 hover:text-white focus:outline-none foucs:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
                onClick={() => {
                  {
                    setModalVisible(true);
                    setSelectedBranch(branch);
                    setUpdatingName(branch.name);
                  }
                }}
              >
                {branch.name}
              </button>
            </div>
          ))}
        </div>
        <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
          <CategoryForm
            value={updatingName}
            setValue={(value) => setUpdatingName(value)}
            handleSubmit={handleUpdateBranch}
            buttonText="Update"
            handleDelete={handleDeleteBranch}
          />
        </Modal>
      </div>
    </div>
  );
};
export default BranchList;