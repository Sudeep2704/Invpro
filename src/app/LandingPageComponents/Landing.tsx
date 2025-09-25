"use client";
import React, { useEffect, useState } from "react";
import { Activity, Lock, Clock, FolderKanban, BarChart3 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { GlowingEffect } from "../../components/ui/glowing-effect";
import { Vortex } from "../../components/ui/vortex";
import Footer from "./Footer"


export default function LandingPage() {
return(
    <>
    <main className="bg-black">
    {/* Navbar */}
    <nav className="navbar text-white pt-3 pb-3 bg-black border-b border-white flex justify-between items-center">
  {/* Logo */}
  <div className="logo text-3xl font-bold px-5 py-2">InvPro</div>

  {/* Buttons on right */}
  <div className="flex gap-3 px-5">
    <button className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
  <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
    Sign Up
  </span>
</button>
    <button className="px-4 py-2 border border-white rounded-md hover:bg-white hover:text-white transition">
      Sign In
    </button>
  </div>
</nav>
    
    
    {/* hero opening section vortex */}
    <div className="w-[calc(100%)] mx-auto rounded-md h-[40rem] overflow-hidden">
      <Vortex
        backgroundColor="black"
        className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full"
      >
        <h2 className="text-white text-2xl md:text-6xl font-bold text-center">
          Turn Invoices Into Business Insights
        </h2>
        <p className="text-white text-sm md:text-2xl max-w-xl mt-6 text-center">
          This is chemical burn. It&apos;ll hurt more than you&apos;ve ever been
          burned and you&apos;ll have a scar.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
          <button className="bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6  text-white inline-block">
  <span className="absolute inset-0 overflow-hidden rounded-full">
    <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
  </span>
  <div className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-0.5 px-4 ring-1 ring-white/10 ">
    <span className="text-lg">
      Get Started For Free
    </span>
    <svg
      fill="none"
      height="40"
      viewBox="0 0 24 24"
      width="40"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.75 8.75L14.25 12L10.75 15.25"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  </div>
  <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
</button>
        </div>
      </Vortex>
    </div>
    
    {/* Feature display */}
    <div className=" w-[calc(100%-4rem)] mx-auto h-[50rem] text-white">
  <h1 className="text-[#D5D5D5] text-4xl font-bold ">Tired of Manually Managing Invoices ?</h1>
  <p className="text-2xl font-light max-w-5xl mt-2">It&apos;s slow, stressful, and full of errors. Introducing InvPro—your smart invoicing dashboard. Get clear insights on what&apos;s paid, what&apos;s pending, and what&apos;s overdue— <i>all in one place.</i></p>
   </div>

{/* Grid Card for features */}
    <div className=" w-[calc(100%-4rem)] mx-auto h-[30rem]">
      <h1 className="text-[#D5D5D5] text-4xl font-bold ">Justified Reasons for 'WHY' InvPro-</h1>
    <ul className= "mt-10 grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2">
      <GridItem
        area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
        icon={<Clock className="h-4 w-4 text-white dark:text-neutral-400" />}
        title="Save Time"
        description="No more manual tracking, Pure optimality"
      />
 
      <GridItem
        area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
        icon={<FolderKanban className="h-4 w-4 text-white dark:text-neutral-400" />}
        title="Stay Organized"
        description="Manage all clients and payments in one place."
      />
 
      <GridItem
        area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
        icon={<BarChart3 className="h-4 w-4 text-white dark:text-neutral-400" />}
        title="Grow Smarter"
        description="Insights help you make better financial decisions. Give more benfits"
      />
 
      <GridItem
        area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
        icon={<Activity className="h-4 w-4 text-white dark:text-neutral-400" />}
        title="Real-Time Tracking"
        description="Know the exact status of every invoice instantly."
      />
 
      <GridItem
        area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
        icon={<Lock className="h-4 w-4 text-white dark:text-neutral-400" />}
        title="Secure Data Storage"
        description="Keep all invoices safe with encrypted cloud backup."
      />
    </ul>
    </div>

  
    


    <div className="">

    <Footer/>
    </div>
    
    </main>
    </>
);
}

{/* For grid card */}
interface GridItemProps {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}
 
const GridItem = ({ area, icon, title, description }: GridItemProps) => {
  return (
    <li className={`min-h-[14rem] list-none ${area}`}>
      <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
        />
        <div className="border-0.75 relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 md:p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border border-gray-600 p-2">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="-tracking-4 pt-0.5 font-sans text-xl/[1.375rem] font-semibold text-balance text-white md:text-2xl/[1.875rem] dark:text-white">
                {title}
              </h3>
              <h2 className="font-sans text-sm/[1.125rem] text-white md:text-base/[1.375rem] dark:text-neutral-400 [&_b]:md:font-semibold [&_strong]:md:font-semibold">
                {description}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}
{/* end of grid card */}



