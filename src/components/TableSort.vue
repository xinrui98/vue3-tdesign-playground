<template>
  <div class="tdesign-demo-block-column-large demo-container">
    <div>
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
      :selected-row-keys="selectedRowKeys"
      :sort="sort"
      :show-sort-column-bg-color="true"
      :pagination="pagination"
      bordered
      lazy-load
      @sort-change="sortChange"
      @change="onChange"
      @select-change="rehandleSelectChange"
    >
    </t-table>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, watch } from "vue";
import { TableRow } from "@/models/test-row";
import moment from "moment/moment";
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

    const selectedRowKeys = ref([]);

    const columns = ref([
      {
        colKey: "row-select",
        type: "multiple",
        // 禁用行选中方式一：使用 disabled 禁用行（示例代码有效，勿删）。disabled 参数：{row: RowData; rowIndex: number })
        // 这种方式禁用行选中，当前行会添加行类名 t-table__row--disabled，禁用行文字变灰
        // disabled: ({ rowIndex }) => rowIndex === 1 || rowIndex === 3,

        // 禁用行选中方式二：使用 checkProps 禁用行（示例代码有效，勿删）
        // 这种方式禁用行选中，行文本不会变灰
        width: 50,
      },
      { colKey: "id", title: "id", width: "100" },
      {
        colKey: "date",
        title: "date",
        width: "140",
        align: "center",
        sortType: "all",
        sorter: true,
      },
      {
        colKey: "run_time",
        title: "run_time",
        sortType: "all",
        sorter: true,
      },
    ]);

    const data = ref([...props.initialData]);

    const pagination = {
      defaultCurrent: 1,
      defaultPageSize: 5,
      total: props.initialData.length,
    };

    // Watcher to update data when initialData changes
    watch(
      () => props.initialData,
      (newData) => {
        data.value = [...newData];
        pagination.total = data.value.length;
      },
      { immediate: true }
    );

    const request = (sort: SortParam) => {
      // 模拟异步请求，进行数据排序
      const timer = setTimeout(() => {
        if (sort) {
          // do not modify the data.value directly using .sort as vue's reactivity may not detect in-place changes well
          data.value = [...data.value].sort((a, b) => {
            const aValue = a[sort.sortBy as keyof TableRow];
            const bValue = b[sort.sortBy as keyof TableRow];

            // Check if both values are date strings
            if (
              typeof aValue === "string" &&
              typeof bValue === "string" &&
              moment(aValue, "YYYY-MM-DD").isValid() &&
              moment(bValue, "YYYY-MM-DD").isValid()
            ) {
              const dateA = new Date(aValue);
              const dateB = new Date(bValue);
              return sort.descending
                ? dateB.getTime() - dateA.getTime()
                : dateA.getTime() - dateB.getTime();
            }

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
    const rehandleSelectChange = (value: any, ctx: any) => {
      selectedRowKeys.value = value;
      console.log("rehandleSelectChange", value, ctx);
    };

    const onChange = (info: any, context: any) => {
      console.log("onChange", info, context);
    };

    return {
      data,
      selectedRowKeys,
      columns,
      sort,
      pagination,
      sortChange,
      rehandleSelectChange,
      onChange,
    };
  },
});
</script>

<style lang="less">
:deep([class*="t-table-expandable-icon-cell"]) .t-icon {
  background-color: transparent;
}
</style>
