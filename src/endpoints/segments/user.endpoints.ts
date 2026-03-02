export const USER_ENDPOINTS = {
  create: "/user/createUser",
  updateEmailAndPhone: (userId: number) =>
    `/user/createEmailandPhoneNumber/${userId}`,
  adminListAll: "/user/admin/listAll",
  adminUpdateHierarchy: (userId: number) =>
    `/user/admin/updateHierarchy/${userId}`,
} as const;
