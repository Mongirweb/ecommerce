import axios from "axios";

export const saveCart = async (cart) => {
  try {
    const { data } = await axios.post("/api/user/saveCart", {
      cart,
    });
    return data;
  } catch (error) {
    console.error(error);
  }
};
export const saveGuestCart = async (cart, token) => {
  try {
    const { data } = await axios.post("/api/user/saveGuestCart", {
      cart,
      token,
    });
    return data;
  } catch (error) {
    console.error(error);
  }
};
export const saveAddress = async (address) => {
  try {
    const { data } = await axios.post("/api/user/saveAddress", {
      address,
    });
    return data;
  } catch (error) {
    console.error(error);
  }
};
export const saveGuestAddress = async (address, token) => {
  try {
    const { data } = await axios.post("/api/user/saveGuestAddress", {
      address,
      token,
    });
    return data;
  } catch (error) {
    console.error(error);
  }
};
export const updateAddress = async (id, address) => {
  try {
    const { data } = await axios.put("/api/user/updateAddress", {
      id,
      address,
    });
    return data;
  } catch (error) {
    return error.response.data.message;
  }
};
export const updateGuestAddress = async (id, address, token) => {
  try {
    const { data } = await axios.put("/api/user/updateGuestAddress", {
      id,
      address,
      token,
    });
    return data;
  } catch (error) {
    return error.response.data.message;
  }
};
export const changeActiveAddress = async (id) => {
  try {
    const { data } = await axios.put("/api/user/manageAddress", {
      id,
    });
    return data;
  } catch (error) {
    return error.response.data.message;
  }
};
export const changeActiveGuestAddress = async (id, token) => {
  try {
    const { data } = await axios.put("/api/user/manageGuestAddress", {
      id,
      token,
    });
    return data;
  } catch (error) {
    return error.response.data.message;
  }
};
export const deleteAddress = async (id) => {
  try {
    const { data } = await axios.delete("/api/user/manageAddress", {
      data: { id },
    });
    return data;
  } catch (error) {
    return error.response.data.message;
  }
};
export const applyCoupon = async (coupon) => {
  const { data } = await axios.post("/api/user/applyCoupon", {
    coupon,
  });
  return data;
};
export const applyGuestCoupon = async (coupon, token) => {
  const { data } = await axios.post("/api/user/applyGuestCoupon", {
    coupon,
    token,
  });
  return data;
};
export const deleteGuestAddress = async (id, token) => {
  try {
    const { data } = await axios.delete("/api/user/manageGuestAddress", {
      data: { id, token },
    });
    return data;
  } catch (error) {
    return error.response.data.message;
  }
};
export const changeUserRole = async (code) => {
  try {
    const { data } = await axios.post("/api/user/changeUserRole", {
      code,
    });
    return data;
  } catch (error) {
    console.error("Error:", error);

    // Return the error as part of the response object
    return {
      success: false, // Indicate failure
      error: error.response
        ? error.response.data
        : "An unexpected error occurred",
      status: error.response ? error.response.status : null,
    };
  }
};
export const updateprofilePicture = async (url) => {
  try {
    const { data } = await axios.put("/api/user/updateProfilePicture", {
      url,
    });
    return data;
  } catch (error) {
    return error.response.data.message;
  }
};
export const updateBusinessInfo = async (info) => {
  try {
    const { data } = await axios.put("/api/user/updateBusinessInfo", {
      info,
    });
    return data;
  } catch (error) {
    return error.response.data.message;
  }
};

export const bringSimilarProducts = async (product, page) => {
  try {
    const { data } = await axios.post("/api/user/bringSimilarProducts", {
      product,
      page,
    });
    return data;
  } catch (error) {
    return error.response.data.message;
  }
};

export const bringRelatedProducts = async (product, page) => {
  try {
    const { data } = await axios.post("/api/user/bringRelatedProducts", {
      product,
      page,
    });
    return data;
  } catch (error) {
    return error.response.data.message;
  }
};
