// Helper to show a confirmation dialog using native confirm
// (sweetalert2 was not installed — using native fallback)
export const confirmAction = async (
  title = "Əminsiniz?",
  text = "Bu addım geri qaytarıla bilməz!"
) => {
  const confirmed = window.confirm(`${title}\n${text}`);
  return { isConfirmed: confirmed };
};