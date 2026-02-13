import { useState } from 'react';
import CaptchaContainer from './component/CaptchaContainer';
import TicketCard from './component/TicketCard';

function App() {
  const [ticket, setTicket] = useState('');

  const captcha = CaptchaContainer({
    onCompleteAction(result) {
      setTicket(result.ticket);
    },
  });

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center justify-center">
        {ticket ? <TicketCard ticket={ticket} /> : <div className="h-[300px] w-[300px]">{captcha}</div>}
      </main>
    </div>
  );
}

export default App;
