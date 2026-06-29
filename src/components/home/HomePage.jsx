"use client";

import Hero from "./Hero";
import LatestTasks from "./LatestTasks";
import TopFreelancers from "./TopFreelancers";
import HowItWorks from "./HowItWorks";
import PlatformStats from "./PlatformStats";

export default function HomePage() {
  return (
    <>
      <Hero />
      <LatestTasks />
      <TopFreelancers />
      <HowItWorks />
      <PlatformStats />
    </>
  );
}
