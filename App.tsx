import React, { useState, useEffect, useCallback } from 'react';
import type { AttendanceRecord } from './types';
import Header from './components/Header';
import AttendanceForm from './components/AttendanceForm';
import ReportGenerator from './components/ReportGenerator';
import { getAttendanceRecords, saveAttendanceRecord } from './services/apiService';

const App: React.FC = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecords = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      const records = await getAttendanceRecords();
      setAttendanceRecords(records.sort((a, b) => b.date.localeCompare(a.date)));
    } catch (err) {
      setError("Không thể tải dữ liệu điểm danh. Vui lòng thử lại sau.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);


  const handleSaveAttendance = async (newRecord: AttendanceRecord): Promise<void> => {
     // Check for duplicates before attempting to save
    if (attendanceRecords.some(record => record.id === newRecord.id)) {
      alert(`Lớp ${newRecord.grade}${newRecord.className} tiết ${newRecord.period} đã được điểm danh rồi.`);
      return Promise.resolve(); // Return resolved promise to stop processing
    }

    await saveAttendanceRecord(newRecord);
    // After saving, fetch all records again to ensure UI is in sync
    await fetchRecords(); 
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800">
      <Header />
      <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
                <strong className="font-bold">Lỗi!</strong>
                <span className="block sm:inline"> {error}</span>
            </div>
        )}
        {isLoading ? (
          <div className="flex items-center justify-center p-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
              <p className="ml-4 text-slate-600 text-lg">Đang tải dữ liệu...</p>
          </div>
        ) : (
          <>
            <AttendanceForm onSave={handleSaveAttendance} allRecords={attendanceRecords} />
            <div className="border-t border-slate-200 pt-8">
              <ReportGenerator records={attendanceRecords} />
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default App;