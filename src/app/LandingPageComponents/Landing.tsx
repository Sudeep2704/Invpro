"use client";
import React, { useEffect, useState } from "react";
import { Activity, Lock, Clock, FolderKanban, BarChart3 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { GlowingEffect } from "../../components/ui/glowing-effect";
import { Vortex } from "../../components/ui/vortex";
import Footer from "./Footer"
import { FaWhatsapp } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import AutoSlider from "./Autoslider";
import Link from "next/link";


export default function LandingPage() {

const slides = [
    { src: "/Landing/Dashboard.png", alt: "Create invoices fast" },
    { src: "/Landing/Analytics.png", alt: "Track payments" },
    { src: "/Landing/Savedinv.png", alt: "Share PDFs" },
  ];



return(
    <>
    <main className="bg-black">
    {/* Navbar */}
    <nav className="navbar text-white pt-3 pb-3 bg-black border-b border-white flex justify-between items-center">
  {/* Logo */}
  <div className="logo text-3xl font-bold px-5 py-2">InvPro</div>

  {/* Buttons on right */}
  <div className="flex gap-3 px-5">
    <Link href="/signup">
    <button className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
  <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
    Sign Up
  </span>
</button>
</Link>
    <Link href="/login">
  <button className="px-4 py-2 border border-white rounded-md hover:bg-white hover:text-black transition mt-1">
    Sign In
  </button>
</Link>
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
          InvPro changes the way you manage invoices forever. It's faster, smarter, and more reliable than traditional methods, helping you stay organized and error-free.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
          <button className="bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6  text-white inline-block">
  <span className="absolute inset-0 overflow-hidden rounded-full">
    <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
  </span>
  <div className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-0.5 px-4 ring-1 ring-white/10 ">
    <Link href="/signup">
    <span className="text-lg">
      Get Started For Free
    </span>
    </Link>
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
    <div className=" w-[calc(100%-4rem)] mx-auto h-[45rem] text-white">
  <h1 className="text-[#D5D5D5] text-4xl font-bold ">Tired of Manually Managing Invoices ?</h1>
  <p className="text-2xl font-light max-w-5xl mt-2 mb-8">It&apos;s slow, stressful, and full of errors. Introducing InvPro—your smart invoicing dashboard. Get clear insights on what&apos;s paid, what&apos;s pending, and what&apos;s overdue— <i>all in one place.</i></p>
  <div className="flex items-center gap-8">
  {/* Image on the left */}
  <div className="flex-shrink-0">
    <img
      src="/Dashboard.png"
      alt="Invoice Dashboard Preview"
      className="rounded-xl shadow-lg max-h-[450px] object-contain"
    />
  </div>

  {/* Text content on the right */}
  <div className="max-w-lg">
    <h2 className="text-2xl font-bold text-[#D5D5D5] mb-2">
      Why Choose InvPro?
    </h2>
    <p className="text-lg text-gray-300 leading-relaxed">
      InvPro makes invoice management simple and stress-free. Automate tracking,
      minimize errors, and gain instant insights into what&apos;s paid, pending, or overdue —
      all in a single dashboard.
    </p>
    <ul className="list-disc list-inside text-gray-300 space-y-2 text-lg">
      <li><span className="font-semibold">Real-time updates</span> — know the status of every invoice instantly.</li>
      <li><span className="font-semibold">Analytics dashboard</span> — track cash flow trends and customer payment behavior.</li>
      <li><span className="font-semibold">Secure & accessible</span> — manage your invoices anytime, anywhere.</li>
    </ul>
    <p className="text-2xl text-gray-400 leading-relaxed mt-4"><i>
      With InvPro, you focus less on paperwork and more on growing your business.</i>
    </p>
  </div>
</div>
   </div>

{/* Grid Card for features */}
    <div className=" w-[calc(100%-4rem)] mx-auto h-[30rem] mb-[10rem]">
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



{/* Testimonials */}
<div className=" w-[calc(100%-4rem)] mx-auto h-[45rem] text-white">
      <h2 className="text-white text-3xl md:text-5xl font-bold text-center mb-8">Testimonials</h2>
      <div className="max-w-6xl mx-auto"> {/* limit width */}
    <AutoSlider slides={slides} interval={4500} />
  </div>
    </div>


  {/* growth */}
    <div className=" w-[calc(100%-4rem)] mx-auto h-[20rem] text-white">
      <h2 className="text-white text-3xl md:text-5xl font-bold text-center">Start Your Growth Journey with InvPro Today</h2>
      <p className="mt-6 mb-6 px-1 text-gray-300 text-2xl text-center">
Whether you’re a beginner or a seasoned investor, our platform empowers you to make data-driven decisions, minimize risks, and maximize growth. Join thousands of investors already achieving their financial goals—your smarter investing journey starts today!
</p>
<span className="flex justify-center space-x-5">
  <button
    className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-md 
               hover:bg-green-800 active:scale-95 transition transform duration-150 ease-in-out"
  >
    <FaWhatsapp className="text-lg" />
    Whatsapp
  </button>

  <button
    className="flex items-center gap-2 bg-red-700 text-white px-4 py-2 rounded-md 
               hover:bg-red-800 active:scale-95 transition transform duration-150 ease-in-out"
  >
    <MdEmail className="text-lg" />
    Email us
  </button>
</span>
    </div>

{/* Footer */}
    <div className="Footer">
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



