<<<<<<< HEAD
export function sleepAsync(ms) {
=======
export default function(ms) {
>>>>>>> 4eb7dd4... Added BaseControl and ControlManager implementation
  return new Promise(resolve => setTimeout(resolve, ms));
}
