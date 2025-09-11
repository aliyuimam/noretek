"use client";

import Footer from "@/MainComponent/Footer";
import Navbar from "@/MainComponent/Navbar";


const CustomerSupportLanding = () => {
 

  return (
   <><Navbar />
         <section className="homeAbout min-vh-100 section-bg pb-0">
           <div className="container-fluid " data-aos="fade-up">
             <div className="row text-center justify-content-center align-items-center">
               <div className=" col-lg-12 col-12 py-5 bg-primary ">
                 <div className="section-title py-2 ">
                   <h1 className=" text-light fw-bold">Customer Support</h1>
                   <p>
                     Were here to help you 24/7. Get the support you need, when you
                     need it.
                   </p>
                 </div>
               </div>
             </div>
           </div>
           <div className="container" data-aos="fade-up">
             <div className="section-title ">
               <h2 className=" text-center fw-bold   pt-4 text-dark">
                 How Can We Help You?
               </h2>
               <p className="text-center py-2">
                 Choose the support option that works best for you
               </p>
             </div>
             <div className=" row text-center justify-content-center py-4 align-items-center ">
               <div className=" col-lg-4  pb-3">
                 <div class="card border-0 shadow-sm p-4">
                   <i className=" bi bi-telephone display-6 pt-3 text-primary"></i>
                   <div class="card-body">
                     <h5 class="card-title fw-bold">Phone Support</h5>
                     <p class="card-text text-dark pt-3">
                       Speak directly with our support team for immediate
                       assistance.
                     </p>
                     <div className=" d-flex ms-4 flex-column d-block text-start">
                       <i className="bi bi-check fst-normal mx-2">
                         24/7 available
                       </i>
                       <i className="bi bi-check fst-normal mx-2">
                         Immediate response
                       </i>
                       <i className="bi bi-check fst-normal mx-2">
                         Expert technicians
                       </i>
                       <i className="bi bi-check fst-normal mx-2">
                         Emergency Support
                       </i>
                     </div>
                   </div>
   
                   <button
                     type="submit"
                     className="btn  bg-primary text-light w-100  p-md-2   m-0 fw-bold  "
                   >
                     Call Now
                   </button>
                   <p class="card-text text-dark pt-3 fst-italic text-muted">
                     +234 (0) 123 456 7890
                   </p>
                 </div>
               </div>
               <div className=" col-lg-4  pb-3">
                 <div class="card border-0 shadow-sm p-4">
                   <i className=" bi bi-chat display-6 pt-3 text-primary"></i>
                   <div class="card-body">
                     <h5 class="card-title fw-bold">Live Chat</h5>
                     <p class="card-text text-dark pt-3">
                       Get instant help through our live chat support system.
                     </p>
                     <div className=" d-flex ms-4 flex-column d-block text-start">
                       <i className="bi bi-check fst-normal mx-2">
                         Real-time assistance
                       </i>
                       <i className="bi bi-check fst-normal mx-2">
                         Quick responses
                       </i>
                       <i className="bi bi-check fst-normal mx-2">
                         Screen sharing
                       </i>
                       <i className="bi bi-check fst-normal mx-2">File uploads</i>
                     </div>
                   </div>
   
                   <button
                     type="submit"
                     className="btn  bg-primary text-light w-100  p-md-2   m-0 fw-bold  "
                   >
                     Start Chat
                   </button>
                   <p class="card-text text-dark pt-3 fst-italic text-muted">
                     Available 24/7
                   </p>
                 </div>
               </div>
               <div className=" col-lg-4  pb-3">
                 <div class="card border-0 shadow-sm p-4">
                   <i className=" bi bi-envelope-at display-6 pt-3 text-primary"></i>
                   <div class="card-body">
                     <h5 class="card-title fw-bold">Email Support</h5>
                     <p class="card-text text-dark pt-3">
                       Send us detailed questios and receive comprehensive answers.
                     </p>
                     <div className=" d-flex ms-4 flex-column d-block text-start">
                       <i className="bi bi-check fst-normal mx-2">
                         Detailed responses
                       </i>
                       <i className="bi bi-check fst-normal mx-2">Documentation</i>
                       <i className="bi bi-check fst-normal mx-2">
                         Follow-up support
                       </i>
                       <i className="bi bi-check fst-normal mx-2">
                         Priority handling
                       </i>
                     </div>
                   </div>
   
                   <button
                     type="submit"
                     className="btn  bg-primary text-light w-100  p-md-2   m-0 fw-bold  "
                   >
                     Send Email
                   </button>
                   <p class="card-text text-dark pt-3 fst-italic text-muted">
                     support@noretek.com
                   </p>
                 </div>
               </div>
             </div>
           </div>
   
           <div className="container" data-aos="fade-up">
             <div className="section-title ">
               <h2 className=" text-center fw-bold   pt-4 text-dark">
                 Frequently Asked Questions
               </h2>
               <p className="text-center py-2">
                 Quick answers to common Questions
               </p>
             </div>
             <div className=" row text-center justify-content-center py-4 align-items-center ">
               <div className=" col-lg-12  pb-3">
                 <div class="card border-0 shadow-sm p-4">
                   <div class="card-body">
                     <h5 class="card-title fw-semibold fs-6 text-start">
                       How do i report a gas leak?
                     </h5>
                     <p class="card-text text-start text-dark pt-3">
                       Call our emergency hotline immediatetly at +234 (0) 123 456
                       7890. Do not use electrical devices or open flames near the
                       suspected leak area.
                     </p>
                   </div>
                 </div>
               </div>
               <div className=" col-lg-12  pb-3">
                 <div class="card border-0 shadow-sm p-4">
                   <div class="card-body">
                     <h5 class="card-title fw-semibold fs-6 text-start">
                       How can i check my gas usage?
                     </h5>
                     <p class="card-text text-start text-dark pt-3">
                       Log into your customer portal or use our mobile app to view
                       real-time usage data, billing information, and usage
                       history.
                     </p>
                   </div>
                 </div>
               </div>
               <div className=" col-lg-12  pb-3">
                 <div class="card border-0 shadow-sm p-4">
                   <div class="card-body">
                     <h5 class="card-title fw-semibold fs-6 text-start">
                       What should i do if my gas supply is interrupted?
                     </h5>
                     <p class="card-text text-start text-dark pt-3">
                       First, check if there are any scheduled maintenance
                       notifications. If not, contact our support team immediiately
                       for assistance.
                     </p>
                   </div>
                 </div>
               </div>
               <div className=" col-lg-12  pb-3">
                 <div class="card border-0 shadow-sm p-4">
                   <div class="card-body">
                     <h5 class="card-title fw-semibold fs-6 text-start">
                       How do i update my billing information?
                     </h5>
                     <p class="card-text text-start text-dark pt-3">
                       You can update your billing information through your online
                       account, by calling customer service, or visiting our
                       office.
                     </p>
                   </div>
                 </div>
               </div>
             </div>
           </div>
   
           <div className="container-fluid bg-danger  text-center ">
             <div className="row text-center justify-content-center align-items-center">
               <div
                 className="   my-4 p-md-5  text-center justify-content-center align-items-center  w-100"
                 style={{ maxWidth: 700 }}
               >
                 <h4 className=" text-center  fw-semibold py-2  text-light">
                   Emergency Support
                 </h4>
                 <p className="mb-6 text-light">
                   For gas leaks or other emergencies, contact us immediately.
                 </p>
                 <div className="row mb-3 d-flex flex-row justify-content-center align-items-center text-center g-0">
                   <div className=" col-lg-4 mt-2 mt-md-0 ">
                     <button
                       type="submit"
                       className="btn bg-light text-danger  w-100  p-lg-1   m-0 fw-bold"
                     >
                       Call Emergency Line
                     </button>
                   </div>
                   <div className=" col-lg-4 mt-2 mt-md-0  ms-2">
                     <button
                       type="submit"
                       className="btn   w-100  p-lg-1  bg-danger m-0 text-light fw-bold "
                     >
                       +234 (0) 123 456 7890
                     </button>
                   </div>
                 </div>
               </div>
             </div>
           </div>
         </section>
         <Footer/></>
  );
};

export default CustomerSupportLanding;
