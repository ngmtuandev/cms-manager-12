import React from "react";
import { Carousel, Table } from "antd";
import type { TableProps } from "antd";
import { getSize } from "../../helpers/getSize";

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

interface TableShowOptions {
  data: any;
}

const TableShowOptions: React.FC<TableShowOptions> = ({ data }) => {
  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Màu",
      dataIndex: "color",
      key: "color",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Mã màu",
      dataIndex: "colorCode",
      key: "colorCode",
      render: (_, record: any) => {
        return (
          <>{record?.codeColor}</>
        )
      }
    },
    {
      title: "Kích thước",
      dataIndex: "sizeId",
      key: "sizeId",
      render: (_, record: any) => {
        console.log(getSize(record.sizeId[0]));
        return (
          <>
            {record.sizeId.map((size: any) => (
              <div className="text-sm font-medium">
                Kích thước:{" "}
                <span className="text-sm font-normal">
                  {getSize(size).name}/{getSize(size).caption} - SL:{" "}
                  {record.quantity}
                </span>
              </div>
            ))}
          </>
        );
      },
    },
    {
      title: "Hình ảnh",
      dataIndex: "images",
      key: "images",
      render: (_, record: any) => {
        console.log(getSize(record.sizeId[0]));
        return (
          <>
            <div className="h-30 w-20">
              <Carousel afterChange={onChange} className="shadow-lg rounded-sm">
                {record.images && record.images.length > 0 && record.images.map((image:any) => (
                  <img src={image.filePath} alt="" className="h-24 w-20"/>
                ))}
              </Carousel>
            </div>
          </>
        );
      },
    },
  ];

  const onChange = (currentSlide: number) => {
    console.log(currentSlide);
  };

  console.log(data)

  return (
    <div>
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default TableShowOptions;
