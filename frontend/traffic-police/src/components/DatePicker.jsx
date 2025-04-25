// import * as React from 'react';
// import { format } from 'date-fns';
// import { Calendar as CalendarIcon } from 'lucide-react';

// import { Button } from '@/components/ui/button';
// import { Calendar } from '@/components/ui/calendar';
// import {
//   Popover,
//   PopoverTrigger,
//   PopoverContent,
// } from '@/components/ui/popover';

// export default function DatePicker({ date, setDate }) {
//   const [open, setOpen] = React.useState(false);

//   const handleSelect = (selectedDate) => {
//     setDate(selectedDate);
//     setOpen(false); // close after selecting
//   };

//   return (
//     <Popover open={open} onOpenChange={setOpen}>
//       <PopoverTrigger asChild>
//         <Button
//           variant="outline"
//           className="w-[280px] justify-start text-left font-normal"
//         >
//           <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
//           {date ? (
//             format(date, 'PPP')
//           ) : (
//             <span className="text-muted-foreground">Pick a date</span>
//           )}
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent className="w-auto p-0 bg-white shadow-md rounded-md border">
//         <Calendar
//           mode="single"
//           selected={date}
//           onSelect={handleSelect}
//           initialFocus
//         />
//       </PopoverContent>
//     </Popover>
//   );
// }
