-- =====================================================
-- ENABLE REALTIME SYNC FOR LIVE DASHBOARD UPDATES
-- =====================================================
-- Run this in Supabase SQL Editor to make the portal update instantly
-- when any device makes a change.

-- The "supabase_realtime" publication broadcasts database changes via WebSockets.
-- By default, no tables are included. We need to add our core tables so the app
-- can listen to them and auto-refresh the screen.

-- 1. Enable REPLICA IDENTITY FULL for detailed change tracking if needed
-- (Optional but helpful for detailed logs, we stick to default REPLICA IDENTITY for performance)

-- 2. Add tables to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE vargani_slips;
ALTER PUBLICATION supabase_realtime ADD TABLE expenses;
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE members;
ALTER PUBLICATION supabase_realtime ADD TABLE user_profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE audit_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE task_responses;
ALTER PUBLICATION supabase_realtime ADD TABLE vargani_payments;
