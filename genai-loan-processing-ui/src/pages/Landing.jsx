import React from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Landmark,
  UserRound,
  ShieldCheck,
  ArrowRight,
  LockKeyhole,
  FileSearch,
  Sparkles,
} from 'lucide-react';


const Landing = () => {
  const navigate = useNavigate();


  /* =========================================================
     CLIENT ACCESS
  ========================================================= */

  const handleClientAccess = () => {
    // Clear any previous bank session
    sessionStorage.removeItem('loanlens_role');

    // Set client role
    sessionStorage.setItem('loanlens_role', 'client');

    // Client gets ONLY New Application
    navigate('/client/new');
  };


  /* =========================================================
     BANK ACCESS
  ========================================================= */

  const handleBankAccess = () => {
    // Clear previous role
    sessionStorage.removeItem('loanlens_role');

    // Go to secure bank login
    navigate('/login');
  };


  return (
    <div className="min-h-screen bg-banking-background flex flex-col">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="w-full bg-banking-card border-b border-border-light">

        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 h-16 sm:h-20 flex items-center justify-between">

          {/* BRAND */}

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-banking-navy flex items-center justify-center shadow-sm">

              <Landmark
                size={22}
                className="text-white"
              />

            </div>

            <div>

              <h1 className="font-bold text-banking-navy text-base sm:text-lg leading-tight">
                LoanLens
              </h1>

              <p className="text-[10px] sm:text-xs text-text-muted">
                AI Loan Processing System
              </p>

            </div>

          </div>


          {/* SECURITY */}

          <div className="hidden sm:flex items-center gap-2 text-xs text-text-secondary">

            <ShieldCheck
              size={16}
              className="text-banking-success"
            />

            <span>
              Secure Banking Platform
            </span>

          </div>

        </div>

      </header>


      {/* =====================================================
          MAIN
      ====================================================== */}

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-10 sm:py-14">

        <div className="w-full max-w-6xl">


          {/* =================================================
              HERO
          ================================================= */}

          <section className="text-center mb-10 sm:mb-14">

            {/* AI BADGE */}

            <div className="inline-flex items-center gap-2 bg-banking-softBlue text-banking-primary px-4 py-2 rounded-full text-xs sm:text-sm font-medium mb-5">

              <Sparkles size={15} />

              <span>
                AI-Powered Loan Processing
              </span>

            </div>


            {/* TITLE */}

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary tracking-tight">

              Welcome to LoanLens

            </h2>


            {/* DESCRIPTION */}

            <p className="max-w-2xl mx-auto mt-4 text-sm sm:text-base lg:text-lg text-text-secondary leading-relaxed">

              A smarter and simpler way to process, verify and manage
              loan applications with AI-assisted document analysis.

            </p>


            <p className="mt-3 text-sm text-text-muted">

              Please select how you want to continue.

            </p>

          </section>


          {/* =================================================
              ROLE CARDS
          ================================================== */}

          <section className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-7 max-w-4xl mx-auto">


            {/* =================================================
                CLIENT
            ================================================= */}

            <button
              type="button"
              onClick={handleClientAccess}
              className="
                group
                text-left
                bg-banking-card
                border
                border-border
                rounded-xl
                p-6
                sm:p-8
                shadow-sm
                hover:shadow-lg
                hover:border-banking-primary/40
                hover:-translate-y-1
                transition-all
                duration-300
                focus:outline-none
                focus:ring-2
                focus:ring-banking-primary
                focus:ring-offset-2
              "
            >

              {/* ICON + ARROW */}

              <div className="flex items-start justify-between gap-4">

                <div className="
                  w-14
                  h-14
                  sm:w-16
                  sm:h-16
                  rounded-xl
                  bg-banking-softBlue
                  flex
                  items-center
                  justify-center
                ">

                  <UserRound
                    size={30}
                    className="text-banking-primary"
                  />

                </div>


                <div className="
                  w-9
                  h-9
                  rounded-full
                  bg-banking-background
                  flex
                  items-center
                  justify-center
                  text-text-secondary
                  group-hover:bg-banking-primary
                  group-hover:text-white
                  transition-colors
                ">

                  <ArrowRight size={18} />

                </div>

              </div>


              {/* CONTENT */}

              <div className="mt-7">

                <p className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider
                  text-banking-primary
                  mb-2
                ">
                  Customer Access
                </p>


                <h3 className="
                  text-xl
                  sm:text-2xl
                  font-bold
                  text-text-primary
                ">
                  Client
                </h3>


                <p className="
                  mt-3
                  text-sm
                  sm:text-base
                  text-text-secondary
                  leading-relaxed
                ">

                  Start a new loan application by entering your details
                  and uploading the required documents.

                </p>

              </div>


              {/* ACTION */}

              <div className="
                mt-6
                pt-5
                border-t
                border-border-light
                flex
                items-center
                gap-2
                text-sm
                font-semibold
                text-banking-primary
              ">

                <span>
                  Start New Application
                </span>

                <ArrowRight
                  size={16}
                  className="
                    group-hover:translate-x-1
                    transition-transform
                  "
                />

              </div>

            </button>



            {/* =================================================
                BANK / MANAGER
            ================================================= */}

            <button
              type="button"
              onClick={handleBankAccess}
              className="
                group
                text-left
                bg-banking-navy
                border
                border-banking-navy
                rounded-xl
                p-6
                sm:p-8
                shadow-md
                hover:shadow-xl
                hover:-translate-y-1
                transition-all
                duration-300
                focus:outline-none
                focus:ring-2
                focus:ring-banking-primary
                focus:ring-offset-2
              "
            >

              {/* ICON + ARROW */}

              <div className="flex items-start justify-between gap-4">

                <div className="
                  w-14
                  h-14
                  sm:w-16
                  sm:h-16
                  rounded-xl
                  bg-white/10
                  border
                  border-white/10
                  flex
                  items-center
                  justify-center
                ">

                  <Landmark
                    size={30}
                    className="text-white"
                  />

                </div>


                <div className="
                  w-9
                  h-9
                  rounded-full
                  bg-white/10
                  text-white
                  flex
                  items-center
                  justify-center
                  group-hover:bg-banking-primary
                  transition-colors
                ">

                  <ArrowRight size={18} />

                </div>

              </div>


              {/* CONTENT */}

              <div className="mt-7">

                <div className="
                  flex
                  items-center
                  gap-2
                  mb-2
                ">

                  <p className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-blue-200
                  ">
                    Secure Access
                  </p>

                  <LockKeyhole
                    size={13}
                    className="text-blue-200"
                  />

                </div>


                <h3 className="
                  text-xl
                  sm:text-2xl
                  font-bold
                  text-white
                ">
                  Bank / Manager
                </h3>


                <p className="
                  mt-3
                  text-sm
                  sm:text-base
                  text-blue-100/80
                  leading-relaxed
                ">

                  Access the complete loan processing workspace,
                  application reviews, AI analysis and decision tools.

                </p>

              </div>


              {/* ACTION */}

              <div className="
                mt-6
                pt-5
                border-t
                border-white/10
                flex
                items-center
                gap-2
                text-sm
                font-semibold
                text-white
              ">

                <span>
                  Continue to Secure Login
                </span>

                <ArrowRight
                  size={16}
                  className="
                    group-hover:translate-x-1
                    transition-transform
                  "
                />

              </div>

            </button>

          </section>



          {/* =================================================
              FEATURES
          ================================================= */}

          <section className="
            max-w-4xl
            mx-auto
            mt-8
            sm:mt-10
            grid
            grid-cols-1
            sm:grid-cols-3
            gap-3
          ">


            <Feature
              icon={<FileSearch size={17} />}
              title="Document Processing"
              text="AI-assisted document analysis"
            />


            <Feature
              icon={<Sparkles size={17} />}
              title="AI Insights"
              text="Explainable application analysis"
            />


            <Feature
              icon={<ShieldCheck size={17} />}
              title="Secure Decisions"
              text="Controlled manager authorization"
            />

          </section>



          {/* =================================================
              FOOTER
          ================================================= */}

          <footer className="text-center mt-8 sm:mt-10">

            <div className="
              flex
              items-center
              justify-center
              gap-2
              text-xs
              text-text-muted
            ">

              <ShieldCheck
                size={14}
                className="text-banking-success"
              />

              <span>
                Secure • Reliable • AI-Assisted
              </span>

            </div>

            <p className="text-[11px] text-text-muted mt-2">

              LoanLens • AI-Powered Loan Processing System

            </p>

          </footer>

        </div>

      </main>

    </div>
  );
};


/* =========================================================
   FEATURE COMPONENT
========================================================= */

const Feature = ({ icon, title, text }) => {
  return (
    <div className="
      bg-banking-card
      border
      border-border-light
      rounded-lg
      p-4
      flex
      items-center
      gap-3
    ">

      <div className="
        w-9
        h-9
        rounded-md
        bg-banking-softBlue
        text-banking-primary
        flex
        items-center
        justify-center
        shrink-0
      ">
        {icon}
      </div>


      <div className="min-w-0">

        <p className="
          text-sm
          font-semibold
          text-text-primary
        ">
          {title}
        </p>

        <p className="
          text-xs
          text-text-muted
          mt-0.5
        ">
          {text}
        </p>

      </div>

    </div>
  );
};


export default Landing;