"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  ChevronRight,
  Star,
  Quote,
  UserPlus,
  FileSpreadsheet,
  UserCheck,
  Search,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";

export default function Home() {
  // Add scroll animation functionality
  useEffect(() => {
    const animateOnScroll = () => {
      const elements = document.querySelectorAll(".animate-on-scroll");

      elements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < window.innerHeight - elementVisible) {
          element.classList.add("animate-in");
        }
      });
    };

    // Run once on load
    animateOnScroll();

    // Add scroll event listener
    window.addEventListener("scroll", animateOnScroll);

    // Clean up
    return () => window.removeEventListener("scroll", animateOnScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section - Reduced Top Space */}
      <section className="pt-8 pb-16 md:pt-12 md:pb-24">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 ease-out">
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                <Badge className="mb-6 bg-teal-100 text-teal-700 hover:bg-teal-200 self-start px-4 py-1.5 text-sm font-medium">
                  Healthcare Management
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight">
                  Streamline Your{" "}
                  <span className="text-teal-600 relative">
                    Healthcare
                    <span className="absolute bottom-1 left-0 w-full h-3 bg-teal-100 -z-10 opacity-50"></span>
                  </span>{" "}
                  Management
                </h1>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  A comprehensive solution for healthcare providers to manage
                  clients, programs, and enrollments efficiently in one secure
                  platform.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/register">
                    <Button
                      size="lg"
                      className="bg-teal-600 hover:bg-teal-700 text-white font-medium px-8 py-6 transition-all duration-300 ease-in-out hover:translate-y-[-2px]"
                    >
                      Get Started
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-teal-600 text-teal-600 hover:bg-teal-50 font-medium px-8 py-6 transition-all duration-300"
                    >
                      Sign In
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="lg:w-1/2 bg-gradient-to-br from-teal-50 to-blue-50 p-8 md:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-teal-100 rounded-full opacity-30 -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-100 rounded-full opacity-30 -ml-20 -mb-20"></div>

                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="bg-white rounded-xl p-4 border border-teal-100 max-w-md transform hover:scale-[1.02] transition-all duration-300 ease-in-out">
                    <Image
                      src="/dashboard-preview.png"
                      alt="Health Information System Dashboard"
                      width={500}
                      height={400}
                      className="rounded-lg"
                    />
                    <div className="absolute -bottom-6 -right-6 bg-teal-600 text-white rounded-xl p-4 max-w-xs transform hover:scale-105 transition-transform duration-300">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center">
                          <CheckCircle className="h-6 w-6 text-teal-600" />
                        </div>
                        <div>
                          <p className="font-medium">
                            Client enrollment complete
                          </p>
                          <p className="text-sm text-teal-100">
                            Program: Diabetes Management
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section - Redesigned with Direction */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 ease-out">
            <Badge className="mb-4 bg-teal-100 text-teal-700 hover:bg-teal-200 px-4 py-1.5">
              How It Works
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Streamlined Healthcare Management
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Our platform simplifies the entire process from client
              registration to program management
            </p>
          </div>

          <div className="max-w-5xl mx-auto relative">
            {/* Workflow Steps */}
            <div className="flex flex-col md:flex-row items-start justify-between relative">
              {/* Connecting Line - Desktop Only */}
              <div className="hidden md:block absolute top-24 left-0 right-0 h-1 bg-teal-100 z-0"></div>

              {/* Step 1 */}
              <div
                className="flex flex-col items-center mb-8 md:mb-0 w-full md:w-1/4 relative z-10 animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 ease-out"
                style={{ transitionDelay: "100ms" }}
              >
                <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mb-4 hover:bg-teal-200 transition-colors duration-300">
                  <UserPlus className="h-10 w-10 text-teal-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2 text-center">
                  Client Registration
                </h3>
                <p className="text-sm text-gray-600 text-center px-2">
                  Register new clients with comprehensive intake forms
                </p>
                <div className="hidden md:flex absolute -right-4 top-20">
                  <ArrowRight className="h-8 w-8 text-teal-500" />
                </div>
              </div>

              {/* Step 2 */}
              <div
                className="flex flex-col items-center mb-8 md:mb-0 w-full md:w-1/4 relative z-10 animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 ease-out"
                style={{ transitionDelay: "200ms" }}
              >
                <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mb-4 hover:bg-teal-200 transition-colors duration-300">
                  <FileSpreadsheet className="h-10 w-10 text-teal-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2 text-center">
                  Program Registration
                </h3>
                <p className="text-sm text-gray-600 text-center px-2">
                  Create and customize healthcare programs
                </p>
                <div className="hidden md:flex absolute -right-4 top-20">
                  <ArrowRight className="h-8 w-8 text-teal-500" />
                </div>
              </div>

              {/* Step 3 */}
              <div
                className="flex flex-col items-center mb-8 md:mb-0 w-full md:w-1/4 relative z-10 animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 ease-out"
                style={{ transitionDelay: "300ms" }}
              >
                <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mb-4 hover:bg-teal-200 transition-colors duration-300">
                  <UserCheck className="h-10 w-10 text-teal-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2 text-center">
                  Client Enrollment
                </h3>
                <p className="text-sm text-gray-600 text-center px-2">
                  Enroll clients into appropriate programs
                </p>
                <div className="hidden md:flex absolute -right-4 top-20">
                  <ArrowRight className="h-8 w-8 text-teal-500" />
                </div>
              </div>

              {/* Step 4 */}
              <div
                className="flex flex-col items-center w-full md:w-1/4 relative z-10 animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 ease-out"
                style={{ transitionDelay: "400ms" }}
              >
                <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mb-4 hover:bg-teal-200 transition-colors duration-300">
                  <Search className="h-10 w-10 text-teal-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2 text-center">
                  Search & Reporting
                </h3>
                <p className="text-sm text-gray-600 text-center px-2">
                  Find clients and generate comprehensive reports
                </p>
              </div>
            </div>

            {/* Mobile Direction Indicators */}
            <div
              className="flex md:hidden justify-center my-2 animate-on-scroll opacity-0 transition-all duration-1000 ease-out"
              style={{ transitionDelay: "500ms" }}
            >
              <div className="flex flex-col items-center">
                <ArrowRight className="h-6 w-6 text-teal-500 rotate-90" />
                <ArrowRight className="h-6 w-6 text-teal-500 rotate-90 -mt-1" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section - Revamped with Multiple Reviews */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 ease-out">
            <Badge className="mb-4 bg-teal-100 text-teal-700 hover:bg-teal-200 px-4 py-1.5">
              Testimonials
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              What Our Users Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {/* Testimonial 1 */}
            <div
              className="bg-gradient-to-br from-teal-50 to-white rounded-xl p-5 border border-teal-100 hover:border-teal-200 transition-all duration-300 animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 ease-out"
              style={{ transitionDelay: "100ms" }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-teal-200 rounded-full flex items-center justify-center mr-3">
                    <span className="text-teal-700 font-bold text-sm">DR</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">
                      Dr. Rebecca Johnson
                    </p>
                    <p className="text-xs text-gray-500">Medical Director</p>
                  </div>
                </div>
                <Quote className="h-5 w-5 text-teal-300" />
              </div>
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600">
                "HealthIS has transformed our patient management workflow. The
                platform is intuitive and has significantly improved our
                efficiency."
              </p>
            </div>

            {/* Testimonial 2 */}
            <div
              className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-5 border border-blue-100 hover:border-blue-200 transition-all duration-300 animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 ease-out"
              style={{ transitionDelay: "200ms" }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-700 font-bold text-sm">JT</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">
                      James Thompson
                    </p>
                    <p className="text-xs text-gray-500">
                      Clinic Administrator
                    </p>
                  </div>
                </div>
                <Quote className="h-5 w-5 text-blue-300" />
              </div>
              <div className="flex mb-3">
                {[...Array(4)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 text-yellow-400 fill-yellow-400"
                  />
                ))}
                <Star className="h-4 w-4 text-gray-300" />
              </div>
              <p className="text-sm text-gray-600">
                "The program management features have saved us countless hours.
                Being able to track enrollments in real-time is a game-changer."
              </p>
            </div>

            {/* Testimonial 3 */}
            <div
              className="bg-gradient-to-br from-teal-50 to-white rounded-xl p-5 border border-teal-100 hover:border-teal-200 transition-all duration-300 animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 ease-out"
              style={{ transitionDelay: "300ms" }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-teal-200 rounded-full flex items-center justify-center mr-3">
                    <span className="text-teal-700 font-bold text-sm">SL</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">Sarah Lee</p>
                    <p className="text-xs text-gray-500">
                      Healthcare Coordinator
                    </p>
                  </div>
                </div>
                <Quote className="h-5 w-5 text-teal-300" />
              </div>
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600">
                "The client enrollment process is seamless. I love how easy it
                is to match patients with the right programs based on their
                needs."
              </p>
            </div>

            {/* Testimonial 4 */}
            <div
              className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-5 border border-blue-100 hover:border-blue-200 transition-all duration-300 animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 ease-out"
              style={{ transitionDelay: "400ms" }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-700 font-bold text-sm">MR</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">
                      Dr. Michael Rodriguez
                    </p>
                    <p className="text-xs text-gray-500">Family Physician</p>
                  </div>
                </div>
                <Quote className="h-5 w-5 text-blue-300" />
              </div>
              <div className="flex mb-3">
                {[...Array(4)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 text-yellow-400 fill-yellow-400"
                  />
                ))}
                <Star className="h-4 w-4 text-gray-300" />
              </div>
              <p className="text-sm text-gray-600">
                "The reporting features help me track patient progress across
                different programs. It's made our follow-up care much more
                effective."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - More Subtle */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-teal-500/20 to-blue-500/20 rounded-xl border border-teal-100 overflow-hidden relative animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 ease-out">
            <div className="p-6 md:p-10 text-center relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">
                Ready to Transform Your Healthcare Management?
              </h2>
              <p className="text-base mb-6 max-w-2xl mx-auto text-gray-600">
                Join healthcare providers who are streamlining their operations
                and improving patient care.
              </p>
              <div className="flex flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button
                    size="default"
                    className="bg-teal-600 hover:bg-teal-700 text-white font-medium px-6 py-2 transition-all duration-300"
                  >
                    Get Started Today
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    size="default"
                    variant="secondary"
                    className="bg-white text-teal-700 border border-teal-200 hover:bg-gray-50 font-medium px-6 py-2 transition-all duration-300"
                  >
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Simplified */}
      <footer className="py-8 mt-auto border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-500 text-sm">
            <p>
              &copy; {new Date().getFullYear()} HealthIS. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* CSS for animations */}
      <style jsx global>{`
        .animate-on-scroll {
          transition-property: opacity, transform;
        }

        .animate-in {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
    </div>
  );
}
