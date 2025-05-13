'use client';

import React from 'react';
import MainLayout from '../main-layout';

export default function DisclaimerPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Disclaimer</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Important information about using the HashKey Platform
          </p>
        </div>

        {/* Disclaimer Content */}
        <div className="max-w-4xl mx-auto bg-slate-800/50 rounded-xl border border-slate-700 shadow-lg overflow-hidden">
          <div className="p-8">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">General Information</h2>
              <p className="text-gray-300 mb-4">
                The information provided on this platform is for general informational purposes only. All information on the site is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the platform.
              </p>
              <p className="text-gray-300">
                Under no circumstance shall we have any liability to you for any loss or damage of any kind incurred as a result of the use of the platform or reliance on any information provided on the platform. Your use of the platform and your reliance on any information on the platform is solely at your own risk.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Investment Risks</h2>
              <p className="text-gray-300 mb-4">
                Cryptocurrency investments are subject to high market risk. HashKey is not responsible for your investment decisions. Please be aware that:
              </p>
              <ul className="list-disc pl-6 text-gray-300 space-y-2 mb-4">
                <li>Past performance is not indicative of future results.</li>
                <li>The value of cryptocurrencies can go down as well as up.</li>
                <li>Cryptocurrency investments are not suitable for all investors.</li>
                <li>You should never invest more than you can afford to lose.</li>
                <li>The market for cryptocurrencies is still new and highly volatile.</li>
              </ul>
              <p className="text-gray-300">
                It is important that you understand the risks involved before making any investment decisions. We strongly recommend that you seek professional advice before making any investment decisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">No Financial Advice</h2>
              <p className="text-gray-300 mb-4">
                The information provided on this platform does not constitute investment advice, financial advice, trading advice, or any other sort of advice, and you should not treat any of the platform's content as such.
              </p>
              <p className="text-gray-300">
                HashKey does not recommend that any cryptocurrency should be bought, sold, or held by you. You should conduct your own due diligence and consult your financial advisor before making any investment decisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Smart Contract Risks</h2>
              <p className="text-gray-300 mb-4">
                While every effort has been made to build secure and reliable smart contracts, there is always a risk of vulnerabilities or bugs. We take no responsibility for any losses that may result from the use of our smart contracts. Users should:
              </p>
              <ul className="list-disc pl-6 text-gray-300 space-y-2">
                <li>Understand that smart contracts operate on blockchain technology which may contain bugs or vulnerabilities.</li>
                <li>Acknowledge that once transactions are confirmed on the blockchain, they cannot be reversed or canceled.</li>
                <li>Be aware that smart contracts may behave differently than expected due to blockchain congestion, network forks, or other technical issues.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Regulatory Changes</h2>
              <p className="text-gray-300 mb-4">
                The regulatory landscape for cryptocurrencies and blockchain technology is constantly evolving. Changes in regulations may impact the functionality or legality of the platform in certain jurisdictions.
              </p>
              <p className="text-gray-300">
                It is your responsibility to comply with all applicable laws and regulations in your jurisdiction. HashKey is not responsible for ensuring your compliance with local laws and regulations.
              </p>
            </section>
          </div>

          <div className="px-8 py-6 bg-slate-900/50 border-t border-slate-700">
            <p className="text-center text-gray-400 text-sm">
              By using the HashKey Platform, you acknowledge that you have read, understood, and agree to this disclaimer.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}