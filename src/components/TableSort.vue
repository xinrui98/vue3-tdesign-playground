<template>
  <div class="tdesign-demo-block-column-large demo-container">
    <div>
      <h1>IP 基本信息 (Digital Element)</h1>
      <span style="padding-left: 16px; vertical-align: top"
        >排序：{{ sort }}</span
      >
    </div>

    <!-- 非受控用法：不需要传 sort，或者只需要传 defaultSort: { sortBy: 'status', descending: true }），defaultSort 仅第一次有效 -->
    <!-- 非受控用法，示例代码有效，勿删 -->
    <!-- <t-table rowKey="id" :columns="columns" :data="data" @sort-change="defaultSortChange">
      <template #status="{ row }">
        <p v-if="row.status === 0" class="status">健康</p>
        <p v-if="row.status === 1" class="status warning">警告</p>
        <p v-if="row.status === 2" class="status unhealth">异常</p>
      </template>
    </t-table> -->

    <!-- 受控用法，示例代码有效，勿删 -->
    <t-table
      row-key="index"
      :columns="columns"
      :data="data"
      :sort="sort"
      :show-sort-column-bg-color="true"
      :pagination="pagination"
      bordered
      lazy-load
      @sort-change="sortChange"
      @change="onChange"
    >
    </t-table>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from "vue";
import { TableRow } from "@/models/test-row";
interface SortParam {
  sortBy: string;
  descending: boolean;
}

export default defineComponent({
  name: "TableSort",
  props: {
    initialData: {
      type: Array as PropType<TableRow[]>,
      default: () => [],
    },
  },
  setup(props) {
    const sort = ref<SortParam>();

    const columns = ref([
      { colKey: "applicant", title: "申请人", width: "100" },
      {
        colKey: "time",
        title: "申请耗时(天)",
        width: "140",
        align: "center",
        sortType: "all",
        sorter: true,
      },
      { colKey: "channel", title: "签署方式", width: "120" },
      { colKey: "createTime", title: "申请时间" },
    ]);

    const data = ref([...props.initialData]);

    const pagination = {
      defaultCurrent: 1,
      defaultPageSize: 5,
      total: props.initialData.length,
    };

    const request = (sort: SortParam) => {
      // 模拟异步请求，进行数据排序
      const timer = setTimeout(() => {
        if (sort) {
          // do not modify the data.value directly using .sort as vue's reactivity may not detect in-place changes well
          data.value = [...data.value].sort((a, b) => {
            const aValue = a[sort.sortBy as keyof TableRow];
            const bValue = b[sort.sortBy as keyof TableRow];

            // Ensure both values are numbers before sorting
            if (typeof aValue === "number" && typeof bValue === "number") {
              return sort.descending ? bValue - aValue : aValue - bValue;
            }

            // If not numbers, do not sort them (return 0)
            return 0;
          });
        }
        clearTimeout(timer);
      }, 100);
    };

    const sortChange = (val: SortParam) => {
      sort.value = val;
      request(val);
    };

    const onChange = (info: any, context: any) => {
      console.log("change", info, context);
    };

    return { data, columns, sort, pagination, sortChange, onChange };
  },
});
</script>

<style lang="less">
:deep([class*="t-table-expandable-icon-cell"]) .t-icon {
  background-color: transparent;
}
</style>
