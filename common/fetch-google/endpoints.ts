export const endpoints = {
	uploadFile: '/upload/drive/v3/files?uploadType=media',
	uploadMetadata: (fileId: string) => `/drive/v3/files/${fileId}`,
	getFileData: (fileId: string) => `/drive/v3/files/${fileId}?fields=*`,
	userInfo: '/oauth2/v2/userinfo'
};
