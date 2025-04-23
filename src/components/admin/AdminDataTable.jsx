import { Table, Spinner, Form, InputGroup, Button, Card } from "react-bootstrap";
import { Search, RefreshCw, Download } from "lucide-react";

export default function AdminDataTable({
  columns = [],
  data = [],
  loading = false,
  error = null,
  emptyMessage = "No records found.",
  loadingMessage = "Loading data...",
  searchPlaceholder = "Search...",
  search = "",
  setSearch = () => {},
  renderActions = null,
  onRefresh = null,
  title = null,
}) {
  return (
    <Card className="border-0 shadow-sm">
      {title && (
        <Card.Header className="bg-white py-3 d-flex justify-content-between align-items-center">
          <h5 className="mb-0">{title}</h5>
          <div className="d-flex">
            {onRefresh && (
              <Button 
                variant="outline-secondary" 
                size="sm" 
                className="me-2"
                onClick={onRefresh}
              >
                <RefreshCw size={16} />
              </Button>
            )}
            <Button variant="outline-secondary" size="sm">
              <Download size={16} />
            </Button>
          </div>
        </Card.Header>
      )}
      <Card.Body className="p-3">
        <div className="mb-4 ">
          <InputGroup className="border border-primary border-1">
            <InputGroup.Text className="bg-light border-end-0">
              <Search size={18} />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-start-0 ps-0"
            />
          </InputGroup>
        </div>

        <div className="table-responsive">
          <Table hover bordered className="align-middle mb-0 table-striped">
            <thead className="table-dark">
              <tr>
                {columns.map((column, index) => (
                  <th key={index} className="fw-semibold py-3">
                    {column.header}
                  </th>
                ))}
                {renderActions && <th className="fw-semibold py-3 text-center">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length + (renderActions ? 1 : 0)} className="text-center py-4">
                    <Spinner animation="border" size="sm" className="me-2" />
                    {loadingMessage}
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={columns.length + (renderActions ? 1 : 0)} className="text-center text-danger py-4">
                    {error}
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + (renderActions ? 1 : 0)} className="text-center text-muted py-4">
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                data.map((item, rowIndex) => (
                  <tr key={rowIndex}>
                    {columns.map((column, colIndex) => (
                      <td key={colIndex}>
                        {column.render ? column.render(item) : item[column.accessor]}
                      </td>
                    ))}
                    {renderActions && (
                      <td className="text-center">{renderActions(item)}</td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  );
}