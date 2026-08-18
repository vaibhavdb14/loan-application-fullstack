import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Landmark,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowLeft,
  LockKeyhole,
} from 'lucide-react';


const Login = () => {

  const [showPassword, setShowPassword] = useState(false);

  const [employeeId, setEmployeeId] = useState('');

  const [password, setPassword] = useState('');

  const navigate = useNavigate();


  /* =========================================================
     LOGIN
  ========================================================= */

  const handleLogin = (e) => {

    e.preventDefault();

    /*
     * Frontend demo authentication.
     *
     * Later replace this with your real backend
     * authentication/API call.
     */

    sessionStorage.setItem('loanlens_role', 'bank');

    navigate('/dashboard');

  };


  /* =========================================================
     BACK
  ========================================================= */

  const handleBack = () => {

    sessionStorage.removeItem('loanlens_role');

    navigate('/');

  };


  return (
    <div className="
      min-h-screen
      bg-banking-background
      flex
      items-center
      justify-center
      p-4
    ">

      <div className="w-full max-w-md">


        {/* BACK */}

        <button
          type="button"
          onClick={handleBack}
          className="
            flex
            items-center
            gap-2
            text-text-secondary
            hover:text-banking-primary
            text-sm
            mb-4
            transition-colors
          "
        >

          <ArrowLeft size={17} />

          Back to role selection

        </button>


        {/* LOGIN CARD */}

        <div className="
          bg-banking-card
          rounded-xl
          shadow-sm
          border
          border-border
          p-6
          sm:p-8
        ">


          {/* =================================================
              BRANDING
          ================================================= */}

          <div className="
            flex
            flex-col
            items-center
            justify-center
            mb-8
            text-banking-navy
          ">

            <div className="
              bg-banking-softBlue
              p-3
              rounded-xl
              mb-4
            ">

              <Landmark
                size={40}
                className="text-banking-primary"
              />

            </div>


            <div className="
              flex
              items-center
              gap-2
              text-banking-primary
              text-sm
              font-medium
            ">

              <LockKeyhole size={16} />

              Secure Bank Access

            </div>


            <h1 className="
              text-xl
              sm:text-2xl
              font-bold
              text-text-primary
              text-center
              tracking-tight
              mt-2
            ">

              Bank / Manager Login

            </h1>


            <p className="
              text-text-secondary
              mt-2
              text-sm
              text-center
            ">

              Sign in to access the loan processing workspace.

            </p>


          </div>



          {/* =================================================
              SECURITY MESSAGE
          ================================================= */}

          <div className="
            flex
            items-start
            gap-3
            bg-cyan-50
            border
            border-cyan-200
            rounded-lg
            p-4
            mb-6
          ">

            <ShieldCheck
              size={20}
              className="text-cyan-600 shrink-0 mt-0.5"
            />

            <p className="
              text-sm
              text-cyan-800
              leading-relaxed
            ">

              This area is restricted to authorized bank personnel.
              Your access is protected by secure authentication.

            </p>

          </div>



          {/* =================================================
              LOGIN FORM
          ================================================= */}

          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >


            {/* EMPLOYEE ID */}

            <div>

              <label className="
                block
                text-sm
                font-medium
                text-text-primary
                mb-1.5
              ">

                Employee ID / Identifier

              </label>


              <input
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="e.g. EMP-8492"
                autoComplete="username"
                required
                className="
                  w-full
                  px-4
                  py-3
                  border
                  border-border
                  rounded-md
                  bg-white
                  focus:outline-none
                  focus:ring-2
                  focus:ring-banking-primary
                  focus:border-transparent
                  text-sm
                  text-text-primary
                  transition-all
                "
              />

            </div>



            {/* PASSWORD */}

            <div>

              <label className="
                block
                text-sm
                font-medium
                text-text-primary
                mb-1.5
              ">

                Password

              </label>


              <div className="relative">

                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your secure password"
                  autoComplete="current-password"
                  required
                  className="
                    w-full
                    px-4
                    py-3
                    pr-12
                    border
                    border-border
                    rounded-md
                    bg-white
                    focus:outline-none
                    focus:ring-2
                    focus:ring-banking-primary
                    focus:border-transparent
                    text-sm
                    text-text-primary
                    transition-all
                  "
                />


                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((previous) => !previous)
                  }
                  aria-label={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                  className="
                    absolute
                    right-2
                    top-1/2
                    -translate-y-1/2
                    text-text-muted
                    hover:text-text-primary
                    transition-colors
                    p-2
                  "
                >

                  {showPassword
                    ? <EyeOff size={18} />
                    : <Eye size={18} />
                  }

                </button>

              </div>

            </div>



            {/* OPTIONS */}

            <div className="
              flex
              items-center
              justify-between
              text-sm
              flex-wrap
              gap-2
            ">

              <label className="
                flex
                items-center
                gap-2
                cursor-pointer
              ">

                <input
                  type="checkbox"
                  className="
                    rounded
                    border-border
                    text-banking-primary
                    focus:ring-banking-primary
                    w-4
                    h-4
                  "
                />

                <span className="text-text-secondary">
                  Remember me
                </span>

              </label>


              <button
                type="button"
                className="
                  text-banking-primary
                  font-medium
                  hover:underline
                "
              >
                Forgot password?
              </button>

            </div>



            {/* LOGIN BUTTON */}

            <button
              type="submit"
              className="
                w-full
                bg-banking-primary
                hover:bg-blue-700
                text-white
                font-semibold
                py-3
                rounded-md
                transition-colors
                mt-4
                min-h-[48px]
                flex
                items-center
                justify-center
                gap-2
              "
            >

              <LockKeyhole size={18} />

              Secure Login

            </button>

          </form>



          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="
            mt-8
            pt-5
            border-t
            border-border-light
            flex
            items-center
            justify-center
            gap-2
            text-sm
            text-text-muted
          ">

            <ShieldCheck
              size={16}
              className="text-banking-success"
            />

            Secure Enterprise Portal

          </div>


        </div>

      </div>

    </div>
  );
};


export default Login;