/* eslint-disable react/prop-types */
export default function Table({ children }) {
  return (
      <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
              {children}
          </table>
      </div>
  );
}

// Named exports
export function Thead({ children }) {
  return <thead className="bg-gray-100">{children}</thead>;
}

export function Tbody({ children }) {
  return <tbody>{children}</tbody>;
}

export function Tr({ children }) {
  return <tr className="border-b">{children}</tr>;
}

export function Th({ children }) {
  return <th className="px-4 py-2 text-left font-medium">{children}</th>;
}

export function Td({ children }) {
  return <td className="px-4 py-2">{children}</td>;
}




// export default function Table({ children }) {
//     return (
//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white border border-gray-200">
//           {children}
//         </table>
//       </div>
//     );
//   }
  