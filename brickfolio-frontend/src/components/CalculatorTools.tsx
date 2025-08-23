import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Calculator, TrendingUp, DollarSign, Home, PieChart } from 'lucide-react';

export function CalculatorTools() {
  // ROI Calculator State
  const [roiInputs, setRoiInputs] = useState({
    propertyPrice: 1500000,
    downPayment: 300000,
    rentalIncome: 8000,
    annualAppreciation: 5,
    holdingPeriod: 5
  });

  // Mortgage Calculator State
  const [mortgageInputs, setMortgageInputs] = useState({
    loanAmount: 1200000,
    interestRate: 3.5,
    loanTerm: 25,
    downPayment: 300000
  });

  // Rental Yield Calculator State
  const [rentalInputs, setRentalInputs] = useState({
    propertyValue: 1500000,
    monthlyRent: 8000,
    annualExpenses: 15000
  });

  // ROI Calculations
  const calculateROI = () => {
    const { propertyPrice, downPayment, rentalIncome, annualAppreciation, holdingPeriod } = roiInputs;
    const annualRentalIncome = rentalIncome * 12;
    const totalRentalIncome = annualRentalIncome * holdingPeriod;
    const futureValue = propertyPrice * Math.pow(1 + annualAppreciation / 100, holdingPeriod);
    const capitalGain = futureValue - propertyPrice;
    const totalReturn = totalRentalIncome + capitalGain;
    const roi = ((totalReturn - downPayment) / downPayment) * 100;
    const annualizedROI = roi / holdingPeriod;

    return {
      totalReturn: totalReturn.toFixed(0),
      capitalGain: capitalGain.toFixed(0),
      totalRentalIncome: totalRentalIncome.toFixed(0),
      roi: roi.toFixed(1),
      annualizedROI: annualizedROI.toFixed(1)
    };
  };

  // Mortgage Calculations
  const calculateMortgage = () => {
    const { loanAmount, interestRate, loanTerm } = mortgageInputs;
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTerm * 12;
    const monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                          (Math.pow(1 + monthlyRate, numPayments) - 1);
    const totalPayment = monthlyPayment * numPayments;
    const totalInterest = totalPayment - loanAmount;

    return {
      monthlyPayment: monthlyPayment.toFixed(0),
      totalPayment: totalPayment.toFixed(0),
      totalInterest: totalInterest.toFixed(0)
    };
  };

  // Rental Yield Calculations
  const calculateRentalYield = () => {
    const { propertyValue, monthlyRent, annualExpenses } = rentalInputs;
    const annualRent = monthlyRent * 12;
    const netAnnualRent = annualRent - annualExpenses;
    const grossYield = (annualRent / propertyValue) * 100;
    const netYield = (netAnnualRent / propertyValue) * 100;

    return {
      grossYield: grossYield.toFixed(2),
      netYield: netYield.toFixed(2),
      annualRent: annualRent.toFixed(0),
      netAnnualRent: netAnnualRent.toFixed(0)
    };
  };

  const roiResults = calculateROI();
  const mortgageResults = calculateMortgage();
  const rentalResults = calculateRentalYield();

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Investment Calculators
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Calculate potential returns, mortgage payments, and rental yields to make informed decisions
          </p>
        </div>

        <Tabs defaultValue="roi" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto">
            <TabsTrigger value="roi" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>ROI Calculator</span>
            </TabsTrigger>
            <TabsTrigger value="mortgage" className="flex items-center space-x-2">
              <Home className="h-4 w-4" />
              <span>Mortgage Calculator</span>
            </TabsTrigger>
            <TabsTrigger value="rental" className="flex items-center space-x-2">
              <PieChart className="h-4 w-4" />
              <span>Rental Yield</span>
            </TabsTrigger>
          </TabsList>

          {/* ROI Calculator */}
          <TabsContent value="roi">
            <div className="grid gap-8 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calculator className="h-5 w-5 mr-2" />
                    ROI Calculator Inputs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Property Price (AED)</Label>
                    <Input
                      type="number"
                      value={roiInputs.propertyPrice}
                      onChange={(e) => setRoiInputs({...roiInputs, propertyPrice: Number(e.target.value)})}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>Down Payment (AED)</Label>
                    <Input
                      type="number"
                      value={roiInputs.downPayment}
                      onChange={(e) => setRoiInputs({...roiInputs, downPayment: Number(e.target.value)})}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>Monthly Rental Income (AED)</Label>
                    <Input
                      type="number"
                      value={roiInputs.rentalIncome}
                      onChange={(e) => setRoiInputs({...roiInputs, rentalIncome: Number(e.target.value)})}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>Annual Appreciation (%): {roiInputs.annualAppreciation}%</Label>
                    <Slider
                      value={[roiInputs.annualAppreciation]}
                      onValueChange={(value) => setRoiInputs({...roiInputs, annualAppreciation: value[0]})}
                      max={15}
                      min={0}
                      step={0.5}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Holding Period (Years): {roiInputs.holdingPeriod}</Label>
                    <Slider
                      value={[roiInputs.holdingPeriod]}
                      onValueChange={(value) => setRoiInputs({...roiInputs, holdingPeriod: value[0]})}
                      max={20}
                      min={1}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                    ROI Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{roiResults.annualizedROI}%</div>
                      <div className="text-sm text-gray-600">Annual ROI</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{roiResults.roi}%</div>
                      <div className="text-sm text-gray-600">Total ROI</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                      <span>Total Return</span>
                      <span className="font-semibold text-green-600">AED {Number(roiResults.totalReturn).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                      <span>Capital Gain</span>
                      <span className="font-semibold">AED {Number(roiResults.capitalGain).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                      <span>Total Rental Income</span>
                      <span className="font-semibold">AED {Number(roiResults.totalRentalIncome).toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Mortgage Calculator */}
          <TabsContent value="mortgage">
            <div className="grid gap-8 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Home className="h-5 w-5 mr-2" />
                    Mortgage Inputs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Loan Amount (AED)</Label>
                    <Input
                      type="number"
                      value={mortgageInputs.loanAmount}
                      onChange={(e) => setMortgageInputs({...mortgageInputs, loanAmount: Number(e.target.value)})}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>Interest Rate (%): {mortgageInputs.interestRate}%</Label>
                    <Slider
                      value={[mortgageInputs.interestRate]}
                      onValueChange={(value) => setMortgageInputs({...mortgageInputs, interestRate: value[0]})}
                      max={8}
                      min={2}
                      step={0.1}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Loan Term (Years): {mortgageInputs.loanTerm}</Label>
                    <Slider
                      value={[mortgageInputs.loanTerm]}
                      onValueChange={(value) => setMortgageInputs({...mortgageInputs, loanTerm: value[0]})}
                      max={30}
                      min={5}
                      step={1}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Down Payment (AED)</Label>
                    <Input
                      type="number"
                      value={mortgageInputs.downPayment}
                      onChange={(e) => setMortgageInputs({...mortgageInputs, downPayment: Number(e.target.value)})}
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-blue-600" />
                    Mortgage Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-6 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">AED {Number(mortgageResults.monthlyPayment).toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Monthly Payment</div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                      <span>Total Payment</span>
                      <span className="font-semibold">AED {Number(mortgageResults.totalPayment).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                      <span>Total Interest</span>
                      <span className="font-semibold text-red-600">AED {Number(mortgageResults.totalInterest).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                      <span>Loan Amount</span>
                      <span className="font-semibold">AED {mortgageInputs.loanAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Rental Yield Calculator */}
          <TabsContent value="rental">
            <div className="grid gap-8 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="h-5 w-5 mr-2" />
                    Rental Yield Inputs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Property Value (AED)</Label>
                    <Input
                      type="number"
                      value={rentalInputs.propertyValue}
                      onChange={(e) => setRentalInputs({...rentalInputs, propertyValue: Number(e.target.value)})}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>Monthly Rent (AED)</Label>
                    <Input
                      type="number"
                      value={rentalInputs.monthlyRent}
                      onChange={(e) => setRentalInputs({...rentalInputs, monthlyRent: Number(e.target.value)})}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>Annual Expenses (AED)</Label>
                    <Input
                      type="number"
                      value={rentalInputs.annualExpenses}
                      onChange={(e) => setRentalInputs({...rentalInputs, annualExpenses: Number(e.target.value)})}
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Include maintenance, insurance, management fees, etc.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
                    Rental Yield Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{rentalResults.grossYield}%</div>
                      <div className="text-sm text-gray-600">Gross Yield</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{rentalResults.netYield}%</div>
                      <div className="text-sm text-gray-600">Net Yield</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                      <span>Annual Rent</span>
                      <span className="font-semibold">AED {Number(rentalResults.annualRent).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                      <span>Net Annual Income</span>
                      <span className="font-semibold text-green-600">AED {Number(rentalResults.netAnnualRent).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                      <span>Property Value</span>
                      <span className="font-semibold">AED {rentalInputs.propertyValue.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-10">
          <p className="text-sm text-gray-600 mb-4">
            These calculations are estimates and should not be considered as financial advice.
            Consult with a financial advisor for personalized investment guidance.
          </p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            Get Professional Consultation
          </Button>
        </div>
      </div>
    </section>
  );
}