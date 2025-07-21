'use client';

import { useState } from 'react';
import { FiRepeat, FiRefreshCcw } from 'react-icons/fi';

export default function CurrencyConverter() {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [result, setResult] = useState(null);
  const [rateInfo, setRateInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const currencyCodes = [
    'USD', 'AED', 'AFN', 'ALL', 'AMD', 'ANG', 'AOA', 'ARS', 'AUD', 'AWG',
    'AZN', 'BAM', 'BBD', 'BDT', 'BGN', 'BHD', 'BIF', 'BMD', 'BND', 'BOB',
    'BRL', 'BSD', 'BTN', 'BWP', 'BYN', 'BZD', 'CAD', 'CDF', 'CHF', 'CLP',
    'CNY', 'COP', 'CRC', 'CUP', 'CVE', 'CZK', 'DJF', 'DKK', 'DOP', 'DZD',
    'EGP', 'ERN', 'ETB', 'EUR', 'FJD', 'FKP', 'FOK', 'GBP', 'GEL', 'GGP',
    'GHS', 'GIP', 'GMD', 'GNF', 'GTQ', 'GYD', 'HKD', 'HNL', 'HRK',
  ];

  const fetchConversion = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://v6.exchangerate-api.com/v6/8a85a7c833885550cad71bae/latest/${fromCurrency}`
      );
      const data = await res.json();
      if (data.result === 'success') {
        const rate = data.conversion_rates[toCurrency];
        setRateInfo({
          rate,
          last_update: data.time_last_update_utc,
          allRates: data.conversion_rates,
        });
        setResult(rate * amount);
      } else {
        alert('Failed to fetch rates.');
      }
    } catch (error) {
      console.error(error);
      alert('Exchange API error. Check console.');
    }
    setLoading(false);
  };

  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
    fetchConversion();
  };

return (
  <div className="h-screen flex items-center justify-center bg-[#E8F5F2] px-4">
    <div className="max-w-xl w-full p-6 bg-white shadow-lg rounded-xl border space-y-6">
      <h1 className="text-2xl font-bold text-center text-[#3BA99C]">
        Currency Converter
      </h1>

      {/* Converter Panel */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <input
          type="number"
          min="0"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
          className="flex-1 border px-4 py-2 rounded-md text-lg focus:ring-2 focus:ring-[#3BA99C]"
          placeholder="Enter amount"
        />
        <select
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
          className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3BA99C]"
        >
          {currencyCodes.map((code) => (
            <option key={code}>{code}</option>
          ))}
        </select>
        <button
          className="bg-gray-100 p-2 rounded hover:bg-gray-200 transition"
          title="Swap"
          onClick={swapCurrencies}
        >
          <FiRepeat size={18} />
        </button>
        <select
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
          className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3BA99C]"
        >
          {currencyCodes.map((code) => (
            <option key={code}>{code}</option>
          ))}
        </select>
      </div>

      <button
        onClick={fetchConversion}
        className="w-full bg-[#3BA99C] hover:bg-[#2f867f] text-white py-2 rounded font-semibold flex justify-center items-center gap-2 transition"
      >
        {loading ? (
          <>
            <FiRefreshCcw className="animate-spin" /> Loading...
          </>
        ) : (
          'Convert Currency'
        )}
      </button>

      {result !== null && rateInfo && (
        <div className="text-center space-y-2">
          <p className="text-xl font-bold text-gray-800">
            {amount} {fromCurrency} = {result.toFixed(2)} {toCurrency}
          </p>
          <p className="text-sm text-gray-500">
            1 {fromCurrency} = {rateInfo.rate.toFixed(4)} {toCurrency}
          </p>
          <p className="text-xs text-gray-400">
            Last updated: {rateInfo.last_update}
          </p>
        </div>
      )}

      {rateInfo?.allRates && (
        <div className="mt-6">
          <h3 className="text-md font-semibold mb-2 text-gray-700">
            Other Conversions:
          </h3>
          <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
            {Object.entries(rateInfo.allRates).map(([code, rate]) =>
              code === toCurrency ? null : (
                <div key={code} className="text-sm text-gray-600">
                  {amount} {fromCurrency} = {(amount * rate).toFixed(2)} {code}
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  </div>
);

}
