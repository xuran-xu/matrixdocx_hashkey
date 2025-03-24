'use client';

import React from 'react';
import MainLayout from '../main-layout';
import Link from 'next/link';

export default function DisclaimerPage() {
  return (
    <MainLayout>
      <div className="min-h-screen flex flex-col">
        <div className="container mx-auto px-4 py-12 flex-grow">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-8">
              <Link href="/stake" className="text-primary hover:text-primary/80 mr-4">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <h1 className="text-4xl font-light text-white">Staking Disclaimer</h1>
            </div>
            
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden mb-8">
              <div className="p-8">
                <div className="prose prose-invert max-w-none">
                  <div className="mb-8 p-6 bg-yellow-500/20 border-l-4 border-yellow-500 rounded-lg">
                    <div className="flex items-start">
                      <svg className="w-8 h-8 text-yellow-500 mr-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <div>
                        <h2 className="text-xl font-bold text-yellow-300 mb-2">IMPORTANT RISK WARNING</h2>
                        <p className="text-yellow-200 font-medium">
                          Please read this disclaimer carefully before participating in any staking activities. By using our staking services, you acknowledge that you have read, understood, and agreed to all the terms outlined below.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <h2 className="text-xl font-medium text-white mb-4 flex items-center">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary mr-3">1</span>
                    Risk Warning
                  </h2>
                  <p className="text-slate-300 mb-6 ml-11">
                    Staking operations involve market risks, technical risks, and other unforeseen risks. Users must fully understand these risks and participate cautiously based on their own risk tolerance. HashKey Chain shall not be liable for any losses incurred by users due to participation in Staking.
                  </p>
                  
                  <h2 className="text-xl font-medium text-white mb-4 flex items-center">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary mr-3">2</span>
                    Uncertainty of Returns
                  </h2>
                  <p className="text-slate-300 mb-6 ml-11">
                    Staking returns (including annualized yield and additional rewards) are estimated data. Actual returns may vary due to market fluctuations, technical issues, or other factors. HashKey Chain does not guarantee that users will achieve expected returns.
                  </p>
                  
                  <h2 className="text-xl font-medium text-white mb-4 flex items-center">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary mr-3">3</span>
                    Technical Risks
                  </h2>
                  <p className="text-slate-300 mb-6 ml-11">
                    The Staking function relies on blockchain technology and network stability. There may be technical failures, network delays, or security issues. While HashKey Chain will make every effort to ensure system security, it cannot exclude service interruptions or asset losses caused by technical problems.
                  </p>
                  
                  <h2 className="text-xl font-medium text-white mb-4 flex items-center">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary mr-3">4</span>
                    Compliance
                  </h2>
                  <p className="text-slate-300 mb-6 ml-11">
                    Staking activities must comply with local laws and regulations. Users should ensure that their participation conforms to the legal requirements of their country or region. HashKey Chain shall not be responsible for any consequences arising from users violating applicable laws and regulations.
                  </p>
                  
                  <h2 className="text-xl font-medium text-white mb-4 flex items-center">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary mr-3">5</span>
                    Scope of Disclaimer
                  </h2>
                  <p className="text-slate-300 mb-6 ml-11">
                    HashKey Chain and its affiliates shall not be liable for any direct, indirect, or special losses incurred by users due to participation in Staking activities, including but not limited to asset loss, income loss, or data loss.
                  </p>
                  
                  <h2 className="text-xl font-medium text-white mb-4 flex items-center">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary mr-3">6</span>
                    User Responsibilities
                  </h2>
                  <p className="text-slate-300 mb-6 ml-11">
                    Users must properly safeguard their account information and private keys. Losses caused by user operational errors, account leaks, or private key loss shall not be the responsibility of HashKey Chain.
                  </p>
                  
                  <h2 className="text-xl font-medium text-white mb-4 flex items-center">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary mr-3">7</span>
                    Terms Updates
                  </h2>
                  <p className="text-slate-300 mb-6 ml-11">
                    HashKey Chain reserves the right to modify or update this disclaimer at any time. The revised statement will be published on the official website, and users are required to review it regularly to stay informed of the latest content.
                  </p>
                  
                  <div className="mt-8 p-4 bg-slate-700/30 border border-slate-600/50 rounded-lg">
                    <p className="text-slate-300 italic">
                      Participating in Staking is deemed as the user having read, understood, and agreed to all the contents of this disclaimer. For any questions, please consult a professional legal or financial advisor.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="mb-6 p-4 bg-primary/20 border border-primary/30 rounded-lg text-center max-w-xl">
                <p className="text-white">
                  By clicking "I Understand & Return to Staking", you confirm that you have read and understood all the risks associated with staking.
                </p>
              </div>
              
              <Link 
                href="/stake" 
                className="bg-primary hover:bg-primary/90 text-white font-medium py-4 px-8 rounded-lg transition-colors flex items-center gap-2 text-lg"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                I Understand & Return to Staking
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}