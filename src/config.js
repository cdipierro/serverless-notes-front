export default {
  MAX_ATTACHMENT_SIZE: 5000000,
  STRIPE_KEY: "pk_test_hN34pSV2nPGLF6ccZFv8INnE00BnTQBbAp",
  s3: {
    REGION: "us-east-1",
    BUCKET: "serverless-tutorial-notes-upload",
  },
  apiGateway: {
    REGION: "us-east-1",
    URL: "https://r1rexu087d.execute-api.us-east-1.amazonaws.com/dev",
  },
  cognito: {
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_UoVfoMFOv",
    APP_CLIENT_ID: "32fq12hjlm423ca7k4usbqqe6g",
    IDENTITY_POOL_ID: "us-east-1:65eccf24-ea9e-4587-97ca-6857e62e3c95",
  },
};
