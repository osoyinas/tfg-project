"use client";

import { ContentDetail } from "@/components/content-detail";
import { BookDetailSkeleton } from "@/components/book-detail-skeleton";
import { useKeycloak } from "@/components/keycloak-provider";
import { useAuthAxios } from "@/hooks/useAuthAxios";
import { getItem } from "@/services/getItems";
import { BookItem } from "@/types";
import { useEffect, use, useState } from "react";
import { ProfileSection } from "@/components/profile-section";

interface BookDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function UserProfilePage({ params }: BookDetailsPageProps) {
  const { id } = use(params) as { id: string };
  
  return <ProfileSection userId={id} />;
}
