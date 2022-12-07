import NextcloudClient from "nextcloud-link";

export const testClient: NextcloudClient = createTestClient();

function createTestClient(): NextcloudClient {
  return new NextcloudClient({
    url: "http://localhost:8080/",
    password: "",
    username: "",
  });
}
