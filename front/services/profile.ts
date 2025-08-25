import { Profile, ProfileWithStats, Review } from "@/types";
import { AxiosInstance } from "axios";
import { profile } from "console";

export async function getMyProfile(axios: AxiosInstance): Promise<Profile> {
  try {
    const response = await axios.get("/api/social/profiles/me");
    return mapProfileResponse(response.data) as Profile;
  } catch (error) {
    console.error("Error reviewing item", error);
    throw error;
  }
}
interface UpdateProfileProps {
  bio?: string;
  avatarUrl?: string;
}

export async function updateProfile(
  profile: UpdateProfileProps,
  axios: AxiosInstance
): Promise<Profile> {
  try {
    console.log("Updating profile with data:", profile);
    const response = await axios.patch("/api/social/profiles/me", {
      ...profile,
    });
    return mapProfileResponse(response.data) as Profile;
  } catch (error) {
    console.error("Error updating profile", error);
    throw error;
  }
}
export async function getUserProfile(
  userId: string,
  axios: AxiosInstance
): Promise<ProfileWithStats> {
  try {
    const response = await axios.get(`/api/social/profiles/${userId}/stats`);
    // Si la respuesta tiene stats, devolver como ProfileWithStats
    return mapProfileResponse(response.data) as ProfileWithStats;
  } catch (error) {
    console.error("Error fetching user profile", error);
    throw error;
  }
}

export async function getMyProfileWithStats(
  axios: AxiosInstance
): Promise<ProfileWithStats> {
  try {
    const response = await axios.get("/api/social/profiles/me/stats");
    return mapProfileResponse(response.data) as ProfileWithStats;
  } catch (error) {
    console.error("Error fetching profile with stats", error);
    throw error;
  }
}

export function mapProfileResponse(json: any): Profile | ProfileWithStats {
  if (json.stats) {
    // ProfileWithStats
    console.log("Mapping profile with stats:", json);
    return {
      user: {
        ...json.user.user,
      },
      profile: {
        ...json.user.profile,
      },
      stats: {
        ...json.stats,
      },
    };
  } else {
    console.log("Mapping profile with stats:", json);

    // Profile
    return {
      user: {
        ...json.user,
      },
      profile: {
        ...json.profile,
      },
    };
  }
}
