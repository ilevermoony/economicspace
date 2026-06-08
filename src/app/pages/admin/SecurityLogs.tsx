import { useState, useMemo } from 'react';
import { auditLogger, AuditAction, AuditLog } from '../../utils/security';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Button } from '../../components/ui/button';
import { Shield, AlertTriangle, CheckCircle, XCircle, Download, Filter, Search } from 'lucide-react';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

export function SecurityLogs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'failure'>('all');
  const [actionFilter, setActionFilter] = useState<AuditAction | 'all'>('all');

  const logs = auditLogger.getLogs();

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        !searchQuery ||
        log.userEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.userId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.action.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
      const matchesAction = actionFilter === 'all' || log.action === actionFilter;

      return matchesSearch && matchesStatus && matchesAction;
    });
  }, [logs, searchQuery, statusFilter, actionFilter]);

  const stats = useMemo(() => {
    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

    return {
      total: logs.length,
      failures: logs.filter((l) => l.status === 'failure').length,
      last24h: logs.filter((l) => new Date(l.timestamp) > last24h).length,
      criticalEvents: logs.filter(
        (l) =>
          l.status === 'failure' &&
          (l.action === AuditAction.LOGIN_FAILED ||
            l.action === AuditAction.UNAUTHORIZED_ACCESS)
      ).length,
    };
  }, [logs]);

  const getActionColor = (action: AuditAction): string => {
    switch (action) {
      case AuditAction.LOGIN:
      case AuditAction.LOGOUT:
        return 'bg-blue-100 text-blue-800';
      case AuditAction.LOGIN_FAILED:
      case AuditAction.UNAUTHORIZED_ACCESS:
        return 'bg-red-100 text-red-800';
      case AuditAction.PASSWORD_CHANGE:
        return 'bg-purple-100 text-purple-800';
      case AuditAction.DATA_MODIFY:
      case AuditAction.DATA_DELETE:
        return 'bg-orange-100 text-orange-800';
      case AuditAction.ROLE_CHANGE:
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionLabel = (action: AuditAction): string => {
    const labels: Record<AuditAction, string> = {
      [AuditAction.LOGIN]: 'Login',
      [AuditAction.LOGOUT]: 'Logout',
      [AuditAction.LOGIN_FAILED]: 'Login Gagal',
      [AuditAction.PASSWORD_CHANGE]: 'Ganti Password',
      [AuditAction.DATA_ACCESS]: 'Akses Data',
      [AuditAction.DATA_MODIFY]: 'Modifikasi Data',
      [AuditAction.DATA_DELETE]: 'Hapus Data',
      [AuditAction.ROLE_CHANGE]: 'Ganti Role',
      [AuditAction.SESSION_TIMEOUT]: 'Sesi Timeout',
      [AuditAction.UNAUTHORIZED_ACCESS]: 'Akses Tidak Sah',
    };
    return labels[action];
  };

  const exportLogs = () => {
    const csv = [
      ['Timestamp', 'Action', 'Status', 'User Email', 'User ID', 'Resource', 'Metadata'].join(','),
      ...filteredLogs.map((log) =>
        [
          format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss'),
          log.action,
          log.status,
          log.userEmail || '-',
          log.userId || '-',
          log.resource || '-',
          JSON.stringify(log.metadata || {}),
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `security-logs-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  const clearLogs = () => {
    if (confirm('Apakah Anda yakin ingin menghapus semua log keamanan?')) {
      auditLogger.clearLogs();
      window.location.reload();
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#3D3B46]">Security Logs</h1>
          <p className="text-gray-600">Monitor aktivitas keamanan platform</p>
        </div>
        <Shield className="w-10 h-10 text-[#915D16]" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#3D3B46]">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Events (24 Jam)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.last24h}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Failures</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.failures}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Critical Events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.criticalEvents}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filter & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Cari email, user ID, atau action..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failure">Failure</SelectItem>
              </SelectContent>
            </Select>

            <Select value={actionFilter} onValueChange={(v: any) => setActionFilter(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Action</SelectItem>
                {Object.values(AuditAction).map((action) => (
                  <SelectItem key={action} value={action}>
                    {getActionLabel(action)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 mt-4">
            <Button onClick={exportLogs} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button onClick={clearLogs} variant="outline" size="sm" className="text-red-600">
              <XCircle className="w-4 h-4 mr-2" />
              Clear Logs
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Logs ({filteredLogs.length})</CardTitle>
          <CardDescription>Riwayat aktivitas keamanan terbaru</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Shield className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p>Tidak ada log yang sesuai dengan filter</p>
              </div>
            ) : (
              filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge className={getActionColor(log.action)}>
                          {getActionLabel(log.action)}
                        </Badge>

                        {log.status === 'success' ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                        )}

                        <span
                          className={`text-xs font-medium ${
                            log.status === 'success' ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {log.status === 'success' ? 'Success' : 'Failure'}
                        </span>
                      </div>

                      <div className="text-sm text-gray-600">
                        {log.userEmail && (
                          <div>
                            <strong>User:</strong> {log.userEmail}
                          </div>
                        )}
                        {log.resource && (
                          <div>
                            <strong>Resource:</strong> {log.resource}
                          </div>
                        )}
                        {log.metadata && Object.keys(log.metadata).length > 0 && (
                          <div className="mt-1">
                            <strong>Details:</strong>{' '}
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {JSON.stringify(log.metadata, null, 2)}
                            </code>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-right text-xs text-gray-500 ml-4">
                      <div>{format(new Date(log.timestamp), 'dd MMM yyyy', { locale: localeId })}</div>
                      <div>{format(new Date(log.timestamp), 'HH:mm:ss')}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
